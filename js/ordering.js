document.addEventListener('DOMContentLoaded', () => {
    // Create Modal HTML dynamically if it doesn't exist
    if (!document.querySelector('.modal-overlay')) {
        const modalHTML = `
        <div class="modal-overlay" id="orderModal">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2 class="modal-title">Select Delivery Partner</h2>
                <div class="modal-options">
                    <!-- 1. Grubhub -->
                    <a href="https://www.grubhub.com/restaurant/tandoor-indian-restaurant-27167-mission-blvd-hayward/9615368?utm_source=google&utm_medium=organic&utm_campaign=place-action-link&delivery=true&rwg_token=ACgRB3cmkgYo5pxW1a8Vrq8n0eXWrnkkLO4Fsruh6xdHFCoIlVO0d3Cqfy7s9qeWZXJTSokZuQXuMleLksMpIjDJWRzzv10n3g%3D%3D" class="delivery-card" target="_blank">
                        <div class="partner-name">Grubhub</div>
                        <div class="partner-time">Delivers in 25 min</div>
                    </a>

                    <!-- 2. Online Ordering by DoorDash -->
                    <a href="https://order.online/store/-93209/?delivery=true&hideModal=true&utm_source=gfo&rwg_token=ACgRB3d3h3y4ONtBB4NmpMYGjo4fdg5KJ0wiBdkF5N8n4YXH53xjvMbOHDsgGyM2UgqKLDXu4_q6cWHG4pzLd2c6x1b30tALFQ%3D%3D" class="delivery-card" target="_blank">
                        <div class="partner-name">Online Ordering by DoorDash</div>
                        <div class="partner-time">Delivers in 32 min</div>
                    </a>

                    <!-- 3. Seamless -->
                    <a href="https://www.seamless.com/menu/tandoor-indian-restaurant-27167-mission-blvd-hayward/9615368?utm_source=google&utm_medium=organic&utm_campaign=place-action-link&delivery=true&rwg_token=ACgRB3dei25wgs4p6BimEmE9klFs0kC471sLpy3nem_mLGav39oGAY0MpaNNDeUPUPDvw4LGOgIgQ0HDEwDbWh1cohu9aKBGKQ%3D%3D" class="delivery-card" target="_blank">
                        <div class="partner-name">Seamless</div>
                        <div class="partner-time">Delivers in 25 min</div>
                    </a>

                    <!-- 4. DoorDash -->
                    <a href="https://www.doordash.com/store/tandoor-indian-hayward-93209/?utm_campaign=gpa" class="delivery-card" target="_blank">
                        <div class="partner-name">DoorDash</div>
                        <div class="partner-time">Delivers in 25 min</div>
                    </a>

                    <!-- 5. Caviar -->
                    <a href="https://www.trycaviar.com/store/tandoor-indian-hayward-93209/?utm_campaign=gpa" class="delivery-card" target="_blank">
                        <div class="partner-name">Caviar</div>
                        <div class="partner-time">Delivers in 25 min</div>
                    </a>

                    <!-- 6. Uber Eats -->
                    <a href="https://www.ubereats.com/store/tandoor-27167-mission-blvd/qUSJ5i_MU0qqdMGWo2HfDA?utm_campaign=CM2508147-search-free-nonbrand-google-pas_e_all_acq_Global&utm_medium=search-free-nonbrand&utm_source=google-pas" class="delivery-card" target="_blank">
                        <div class="partner-name">Uber Eats</div>
                        <div class="partner-time">Delivers in 17–32 min</div>
                    </a>

                    <!-- 7. Postmates -->
                    <a href="https://www.postmates.com/store/tandoor-27167-mission-blvd/qUSJ5i_MU0qqdMGWo2HfDA?utm_campaign=CM2508147-search-free-nonbrand-google-pas_e_all_acq_Global&utm_medium=search-free-nonbrand&utm_source=google-pas" class="delivery-card" target="_blank">
                        <div class="partner-name">Postmates</div>
                        <div class="partner-time">Delivers in 17–32 min</div>
                    </a>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('orderModal');
    const closeBtn = modal.querySelector('.modal-close');
    const orderButtons = document.querySelectorAll('a[href="#order"], .order-online-btn, .footer-cta[href="order.html"], .nav-right a[href="order.html"]');
    // Trying to catch various buttons. Note: some links go to order.html directly. 
    // We might want to intercept those or just let them go to the page. 
    // For now, let's target specific "#order" links or add a specific class.

    function openModal(e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Attach to triggers
    // We specifically target links with href="#order" OR class "order-trigger"
    const triggers = document.querySelectorAll('a[href="#order"], .order-trigger, .order-online-btn, .footer-cta[href="order.html"], .nav-right a[href="order.html"]');

    triggers.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    // Close events
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
