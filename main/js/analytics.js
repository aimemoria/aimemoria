// analytics.js - Visitor tracking for Firestore
(function() {
    if (!firebase || !firebase.firestore) return;

    const db = firebase.firestore();

    // Log page visit
    async function logVisit() {
        const visitData = {
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            page: window.location.pathname,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            language: navigator.language,
            location: null
        };

        // Get approximate location from free IP API
        try {
            const response = await fetch('https://ipapi.co/json/');
            const geo = await response.json();
            visitData.location = {
                city: geo.city || 'Unknown',
                region: geo.region || 'Unknown',
                country: geo.country_name || 'Unknown',
                countryCode: geo.country_code || 'XX',
                latitude: geo.latitude || 0,
                longitude: geo.longitude || 0
            };
        } catch (e) {
            visitData.location = { city: 'Unknown', country: 'Unknown' };
        }

        try {
            await db.collection('visits').add(visitData);
        } catch (e) {
            console.warn('Analytics: could not log visit', e);
        }
    }

    // Track section views using IntersectionObserver
    const trackedSections = new Set();

    function trackSectionView(sectionId) {
        if (trackedSections.has(sectionId)) return;
        trackedSections.add(sectionId);

        db.collection('interactions').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            type: 'section_view',
            section: sectionId,
            page: window.location.pathname
        }).catch(function() {});
    }

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && entry.target.id) {
                trackSectionView(entry.target.id);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('section[id]').forEach(function(section) {
        observer.observe(section);
    });

    // Track button/link clicks
    document.addEventListener('click', function(e) {
        var target = e.target.closest('a, button');
        if (!target) return;

        var label = (target.textContent || '').trim().substring(0, 50)
                    || target.getAttribute('aria-label')
                    || 'unknown';

        var closestSection = target.closest('section[id]');

        db.collection('interactions').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            type: 'click',
            element: target.tagName.toLowerCase(),
            label: label,
            section: closestSection ? closestSection.id : 'header/footer',
            page: window.location.pathname
        }).catch(function() {});
    });

    // Track contact form submissions
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            db.collection('interactions').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                type: 'form_submit',
                section: 'contact',
                page: window.location.pathname
            }).catch(function() {});
        });
    }

    logVisit();
})();
