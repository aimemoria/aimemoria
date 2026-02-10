// admin-dashboard.js
(function() {
    var db = firebase.firestore();
    var PASSWORD_HASH = '5dc15fbb0850b035cd0d1121b9c7e231dbe8afc9f3ad20f173a9c3b773ecabc6';

    // DOM elements
    var loginScreen = document.getElementById('login-screen');
    var dashboard = document.getElementById('dashboard');
    var loginForm = document.getElementById('login-form');
    var logoutBtn = document.getElementById('logout-btn');
    var authError = document.getElementById('auth-error');

    // SHA-256 hash function
    async function sha256(message) {
        var msgBuffer = new TextEncoder().encode(message);
        var hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        var hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
    }

    // Check if already logged in
    if (sessionStorage.getItem('admin_auth') === 'true') {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        loadDashboardData();
    }

    // Sign In
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        authError.textContent = '';
        var password = document.getElementById('password').value;
        var hash = await sha256(password);

        if (hash === PASSWORD_HASH) {
            sessionStorage.setItem('admin_auth', 'true');
            loginScreen.style.display = 'none';
            dashboard.style.display = 'block';
            loadDashboardData();
        } else {
            authError.textContent = 'Incorrect password.';
        }
    });

    // Sign Out
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('admin_auth');
        loginScreen.style.display = 'flex';
        dashboard.style.display = 'none';
    });

    // Chart instances (for cleanup on re-render)
    var charts = {};

    function destroyChart(name) {
        if (charts[name]) {
            charts[name].destroy();
            charts[name] = null;
        }
    }

    // Load all dashboard data
    function loadDashboardData() {
        Promise.all([
            loadVisitStats(),
            loadVisitsOverTime(),
            loadLocationStats(),
            loadSectionInteractions(),
            loadClickStats(),
            loadRecentVisits()
        ]).catch(function(err) {
            console.error('Dashboard load error:', err);
        });
    }

    // 1. Summary statistics
    function loadVisitStats() {
        return Promise.all([
            db.collection('visits').get(),
            db.collection('interactions').get()
        ]).then(function(results) {
            var visitsSnap = results[0];
            var interactionsSnap = results[1];

            var totalVisits = visitsSnap.size;

            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var todayVisits = 0;
            var countries = {};

            visitsSnap.docs.forEach(function(doc) {
                var d = doc.data();
                var ts = d.timestamp ? d.timestamp.toDate() : null;
                if (ts && ts >= today) todayVisits++;
                if (d.location && d.location.country) {
                    countries[d.location.country] = true;
                }
            });

            document.getElementById('total-visits').textContent = totalVisits;
            document.getElementById('today-visits').textContent = todayVisits;
            document.getElementById('unique-countries').textContent = Object.keys(countries).length;
            document.getElementById('total-interactions').textContent = interactionsSnap.size;
        });
    }

    // 2. Visits over last 30 days (line chart)
    function loadVisitsOverTime() {
        var thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return db.collection('visits')
            .where('timestamp', '>=', thirtyDaysAgo)
            .orderBy('timestamp')
            .get()
            .then(function(snap) {
                var dayCounts = {};
                for (var i = 0; i < 30; i++) {
                    var d = new Date();
                    d.setDate(d.getDate() - 29 + i);
                    var key = d.toISOString().split('T')[0];
                    dayCounts[key] = 0;
                }

                snap.docs.forEach(function(doc) {
                    var ts = doc.data().timestamp ? doc.data().timestamp.toDate() : null;
                    if (ts) {
                        var key = ts.toISOString().split('T')[0];
                        if (dayCounts[key] !== undefined) dayCounts[key]++;
                    }
                });

                var labels = Object.keys(dayCounts).map(function(d) {
                    return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                });

                destroyChart('visits');
                charts.visits = new Chart(document.getElementById('visitsChart'), {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Visits',
                            data: Object.values(dayCounts),
                            borderColor: '#e94560',
                            backgroundColor: 'rgba(233, 69, 96, 0.1)',
                            fill: true,
                            tension: 0.3
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { labels: { color: '#ccc' } } },
                        scales: {
                            y: { beginAtZero: true, ticks: { color: '#999' }, grid: { color: '#2a2a4a' } },
                            x: { ticks: { color: '#999', maxRotation: 45 }, grid: { color: '#2a2a4a' } }
                        }
                    }
                });
            });
    }

    // 3. Location stats (doughnut chart)
    function loadLocationStats() {
        return db.collection('visits').get().then(function(snap) {
            var countryCounts = {};
            snap.docs.forEach(function(doc) {
                var country = (doc.data().location && doc.data().location.country) || 'Unknown';
                countryCounts[country] = (countryCounts[country] || 0) + 1;
            });

            var sorted = Object.entries(countryCounts)
                .sort(function(a, b) { return b[1] - a[1]; })
                .slice(0, 8);

            var colors = ['#e94560','#4A90D9','#50C878','#F5A623','#9B59B6','#1ABC9C','#E67E22','#95A5A6'];

            destroyChart('locations');
            charts.locations = new Chart(document.getElementById('locationsChart'), {
                type: 'doughnut',
                data: {
                    labels: sorted.map(function(e) { return e[0]; }),
                    datasets: [{
                        data: sorted.map(function(e) { return e[1]; }),
                        backgroundColor: colors
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { labels: { color: '#ccc' } } }
                }
            });
        });
    }

    // 4. Section interaction counts (bar chart)
    function loadSectionInteractions() {
        return db.collection('interactions')
            .where('type', '==', 'section_view')
            .get()
            .then(function(snap) {
                var sectionCounts = {};
                snap.docs.forEach(function(doc) {
                    var section = doc.data().section || 'unknown';
                    sectionCounts[section] = (sectionCounts[section] || 0) + 1;
                });

                var sorted = Object.entries(sectionCounts).sort(function(a, b) { return b[1] - a[1]; });

                destroyChart('sections');
                charts.sections = new Chart(document.getElementById('sectionsChart'), {
                    type: 'bar',
                    data: {
                        labels: sorted.map(function(e) { return e[0]; }),
                        datasets: [{
                            label: 'Views',
                            data: sorted.map(function(e) { return e[1]; }),
                            backgroundColor: '#50C878'
                        }]
                    },
                    options: {
                        responsive: true,
                        indexAxis: 'y',
                        plugins: { legend: { labels: { color: '#ccc' } } },
                        scales: {
                            x: { beginAtZero: true, ticks: { color: '#999' }, grid: { color: '#2a2a4a' } },
                            y: { ticks: { color: '#ccc' }, grid: { color: '#2a2a4a' } }
                        }
                    }
                });
            });
    }

    // 5. Click stats (horizontal bar chart)
    function loadClickStats() {
        return db.collection('interactions')
            .where('type', '==', 'click')
            .get()
            .then(function(snap) {
                var clickCounts = {};
                snap.docs.forEach(function(doc) {
                    var label = doc.data().label || 'unknown';
                    clickCounts[label] = (clickCounts[label] || 0) + 1;
                });

                var sorted = Object.entries(clickCounts)
                    .sort(function(a, b) { return b[1] - a[1]; })
                    .slice(0, 10);

                destroyChart('clicks');
                charts.clicks = new Chart(document.getElementById('clicksChart'), {
                    type: 'bar',
                    data: {
                        labels: sorted.map(function(e) { return e[0]; }),
                        datasets: [{
                            label: 'Clicks',
                            data: sorted.map(function(e) { return e[1]; }),
                            backgroundColor: '#F5A623'
                        }]
                    },
                    options: {
                        responsive: true,
                        indexAxis: 'y',
                        plugins: { legend: { labels: { color: '#ccc' } } },
                        scales: {
                            x: { beginAtZero: true, ticks: { color: '#999' }, grid: { color: '#2a2a4a' } },
                            y: { ticks: { color: '#ccc' }, grid: { color: '#2a2a4a' } }
                        }
                    }
                });
            });
    }

    // 6. Recent visits table
    function loadRecentVisits(filterDate) {
        var query;

        if (filterDate) {
            var start = new Date(filterDate);
            start.setHours(0, 0, 0, 0);
            var end = new Date(filterDate);
            end.setHours(23, 59, 59, 999);
            query = db.collection('visits')
                .where('timestamp', '>=', start)
                .where('timestamp', '<=', end)
                .orderBy('timestamp', 'desc')
                .limit(100);
        } else {
            query = db.collection('visits').orderBy('timestamp', 'desc').limit(100);
        }

        return query.get().then(function(snap) {
            var tbody = document.getElementById('visits-tbody');
            tbody.innerHTML = '';

            if (snap.empty) {
                tbody.innerHTML = '<tr><td colspan="6" class="loading">No visits found</td></tr>';
                return;
            }

            snap.docs.forEach(function(doc) {
                var d = doc.data();
                var ts = d.timestamp ? d.timestamp.toDate() : null;
                var row = document.createElement('tr');
                row.innerHTML =
                    '<td>' + (ts ? ts.toLocaleString() : 'N/A') + '</td>' +
                    '<td>' + ((d.location && d.location.city) || 'Unknown') + '</td>' +
                    '<td>' + ((d.location && d.location.country) || 'Unknown') + '</td>' +
                    '<td>' + (d.page || '/') + '</td>' +
                    '<td>' + (d.referrer || 'direct') + '</td>' +
                    '<td>' + parseDevice(d.userAgent) + '</td>';
                tbody.appendChild(row);
            });
        });
    }

    function parseDevice(ua) {
        if (!ua) return 'Unknown';
        if (/Mobile|Android/i.test(ua)) return 'Mobile';
        if (/Tablet|iPad/i.test(ua)) return 'Tablet';
        return 'Desktop';
    }

    // Date filter controls
    document.getElementById('filter-btn').addEventListener('click', function() {
        var date = document.getElementById('filter-date').value;
        if (date) loadRecentVisits(date);
    });

    document.getElementById('clear-filter-btn').addEventListener('click', function() {
        document.getElementById('filter-date').value = '';
        loadRecentVisits();
    });
})();
