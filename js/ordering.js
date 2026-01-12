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
                    <a href="#" class="delivery-card" target="_blank">
                        <div class="partner-name">Grubhub</div>
                        <div class="partner-fees">Service fee 5%–15% · No delivery fee</div>
                        <div class="partner-time">Delivers in 25 min</div>
                    </a>

                    <!-- 2. Online Ordering by DoorDash -->
                    <a href="#" class="delivery-card" target="_blank">
                        <div class="partner-name">Online Ordering by DoorDash</div>
                        <div class="partner-fees">Service fee 10% · Delivery fee $3.99</div>
                        <div class="partner-time">Delivers in 32 min</div>
                    </a>

                    <!-- 3. Seamless -->
                    <a href="#" class="delivery-card" target="_blank">
                        <div class="partner-name">Seamless</div>
                        <div class="partner-fees">Service fee 5%–15% · No delivery fee</div>
                        <div class="partner-time">Delivers in 25 min</div>
                    </a>

                    <!-- 4. DoorDash -->
                    <a href="#" class="delivery-card" target="_blank">
                        <div class="partner-name">DoorDash</div>
                        <div class="partner-fees">Service fee 15% · Delivery fees start at $2.99</div>
                        <div class="partner-time">Delivers in 25 min</div>
                    </a>

                    <!-- 5. Caviar -->
                    <a href="#" class="delivery-card" target="_blank">
                        <div class="partner-name">Caviar</div>
                        <div class="partner-fees">Service fee 15% · Delivery fees start at $2.99</div>
                        <div class="partner-time">Delivers in 25 min</div>
                    </a>

                    <!-- 6. Uber Eats -->
                    <a href="#" class="delivery-card" target="_blank">
                        <div class="partner-name">Uber Eats</div>
                        <div class="partner-fees">Service fee 5%–15% · Delivery fees start at $0.50</div>
                        <div class="partner-time">Delivers in 17–32 min</div>
                    </a>

                    <!-- 7. Postmates -->
                    <a href="#" class="delivery-card" target="_blank">
                        <div class="partner-name">Postmates</div>
                        <div class="partner-fees">Fees may apply</div>
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
