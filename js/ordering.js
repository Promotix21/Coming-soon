document.addEventListener('DOMContentLoaded', () => {
    // Inject Modal HTML
    const modalHTML = `
    <div id="order-modal" class="order-modal">
        <div class="order-modal-content">
            <button class="close-modal">&times;</button>
            <h2 class="modal-title">How would you like to order?</h2>
            
            <div class="order-tabs">
                <button class="tab-btn active" data-tab="pickup">Pickup</button>
                <button class="tab-btn" data-tab="delivery">Delivery</button>
            </div>

            <div class="tab-content active" id="pickup-options">
                <div class="platforms-grid">
                    <a href="https://www.clover.com/online-ordering/AS6VCTK48YWD1" target="_blank" class="platform-card clover">
                        <span>Order Pickup via Clover</span>
                        <small>Recommended</small>
                    </a>
                    <a href="https://www.seamless.com/menu/tandoor-indian-restaurant-27167-mission-blvd-hayward/9615368" target="_blank" class="platform-card seamless">Seamless</a>
                    <a href="https://www.grubhub.com/restaurant/tandoor-indian-restaurant-27167-mission-blvd-hayward/9615368" target="_blank" class="platform-card grubhub">Grubhub</a>
                    <a href="https://www.ubereats.com/store/tandoor-27167-mission-blvd/qUSJ5i_MU0qqdMGWo2HfDA?diningMode=PICKUP" target="_blank" class="platform-card ubereats">UberEats</a>
                    <a href="https://postmates.com/store/tandoor-27167-mission-blvd/qUSJ5i_MU0qqdMGWo2HfDA?diningMode=PICKUP" target="_blank" class="platform-card postmates">Postmates</a>
                </div>
            </div>

            <div class="tab-content" id="delivery-options">
                <div class="platforms-grid">
                    <a href="https://www.doordash.com/store/tandoor-indian-hayward-93209/" target="_blank" class="platform-card doordash">
                        <span>Order Delivery via DoorDash</span>
                        <small>Recommended</small>
                    </a>
                    <a href="https://order.online/store/-93209/?delivery=true" target="_blank" class="platform-card orderonline">Order.Online</a>
                     <a href="https://www.trycaviar.com/store/tandoor-indian-hayward-93209/293018/" target="_blank" class="platform-card caviar">Caviar</a>
                    <a href="https://www.seamless.com/menu/tandoor-indian-restaurant-27167-mission-blvd-hayward/9615368" target="_blank" class="platform-card seamless">Seamless</a>
                    <a href="https://www.grubhub.com/restaurant/tandoor-indian-restaurant-27167-mission-blvd-hayward/9615368" target="_blank" class="platform-card grubhub">Grubhub</a>
                    <a href="https://www.ubereats.com/store/tandoor-27167-mission-blvd/qUSJ5i_MU0qqdMGWo2HfDA" target="_blank" class="platform-card ubereats">UberEats</a>
                    <a href="https://postmates.com/store/tandoor-27167-mission-blvd/qUSJ5i_MU0qqdMGWo2HfDA" target="_blank" class="platform-card postmates">Postmates</a>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Elements
    const modal = document.getElementById('order-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const tabBtns = modal.querySelectorAll('.tab-btn');
    const tabContents = modal.querySelectorAll('.tab-content');
    const triggers = document.querySelectorAll('.js-order-trigger');

    // Open Modal logic
    window.openOrderModal = function (e) {
        if (e) e.preventDefault();
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Lock scroll
    };

    triggers.forEach(trigger => {
        trigger.addEventListener('click', window.openOrderModal);
    });

    // Close Modal logic
    function closeModal() {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.getElementById(`${tabId}-options`).classList.add('active');
        });
    });
});
