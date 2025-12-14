document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Modal HTML
    const modalHTML = `
    <div class="modal-overlay" id="orderModal">
        <div class="modal-container">
            <button class="modal-close" id="closeModal">&times;</button>
            <div class="modal-header">
                <h2 class="modal-title">Order Online</h2>
            </div>
            
            <div class="order-tabs">
                <button class="order-tab active" data-tab="collection">Pickup</button>
                <button class="order-tab" data-tab="delivery">Delivery</button>
            </div>
            
            <div class="modal-body">
                <!-- Pickup Links -->
                <div class="links-container active" id="collection">
                    <a href="https://www.seamless.com/menu/tandoor-indian-restaurant-27167-mission-blvd-hayward/9615368" target="_blank" class="order-link">
                        <span class="platform-name">Seamless</span>
                        <span class="external-icon">↗</span>
                    </a>
                    <a href="https://www.grubhub.com/restaurant/tandoor-indian-restaurant-27167-mission-blvd-hayward/9615368" target="_blank" class="order-link">
                        <span class="platform-name">GrubHub</span>
                        <span class="external-icon">↗</span>
                    </a>
                    <a href="https://www.clover.com/online-ordering/AS6VCTK48YWD1" target="_blank" class="order-link">
                        <span class="platform-name">Clover (Direct)</span>
                        <span class="external-icon">↗</span>
                    </a>
                    <a href="https://www.ubereats.com/store/tandoor-27167-mission-blvd/qUSJ5i_MU0qqdMGWo2HfDA?diningMode=PICKUP" target="_blank" class="order-link">
                        <span class="platform-name">UberEats</span>
                        <span class="external-icon">↗</span>
                    </a>
                    <a href="https://postmates.com/store/tandoor-27167-mission-blvd/qUSJ5i_MU0qqdMGWo2HfDA?diningMode=PICKUP" target="_blank" class="order-link">
                        <span class="platform-name">Postmates</span>
                        <span class="external-icon">↗</span>
                    </a>
                </div>

                <!-- Delivery Links -->
                <div class="links-container" id="delivery">
                    <a href="https://order.online/store/-93209/?delivery=true" target="_blank" class="order-link">
                        <span class="platform-name">Order Online (Direct)</span>
                        <span class="external-icon">↗</span>
                    </a>
                    <a href="https://www.doorDash.com/store/tandoor-indian-hayward-93209/" target="_blank" class="order-link">
                        <span class="platform-name">DoorDash</span>
                        <span class="external-icon">↗</span>
                    </a>
                    <a href="https://www.ubereats.com/store/tandoor-27167-mission-blvd/qUSJ5i_MU0qqdMGWo2HfDA" target="_blank" class="order-link">
                        <span class="platform-name">UberEats</span>
                        <span class="external-icon">↗</span>
                    </a>
                    <a href="https://www.seamless.com/menu/tandoor-indian-restaurant-27167-mission-blvd-hayward/9615368" target="_blank" class="order-link">
                        <span class="platform-name">Seamless</span>
                        <span class="external-icon">↗</span>
                    </a>
                    <a href="https://www.grubhub.com/restaurant/tandoor-indian-restaurant-27167-mission-blvd-hayward/9615368" target="_blank" class="order-link">
                        <span class="platform-name">GrubHub</span>
                        <span class="external-icon">↗</span>
                    </a>
                     <a href="https://www.trycaviar.com/store/tandoor-indian-hayward-93209/293018/" target="_blank" class="order-link">
                        <span class="platform-name">Caviar</span>
                        <span class="external-icon">↗</span>
                    </a>
                    <a href="https://postmates.com/store/tandoor-27167-mission-blvd/qUSJ5i_MU0qqdMGWo2HfDA" target="_blank" class="order-link">
                        <span class="platform-name">Postmates</span>
                        <span class="external-icon">↗</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 2. CSS Injection (To ensure it works even if I forget to link text css in some file, strictly specific) 
    // Ideally I should link the CSS file, but injecting simple styles here is fail-safe or I rely on linking css/modal.css
    // I will rely on linking css/modal.css in the head of HTML files as per plan.

    // 3. Logic
    const modal = document.getElementById('orderModal');
    const closeBtn = document.getElementById('closeModal');
    const buttons = document.querySelectorAll('.js-order-trigger, .order-btn, a[href="#order"]'); // Selectors for order buttons
    const tabs = document.querySelectorAll('.order-tab');
    const linkContainers = document.querySelectorAll('.links-container');

    // Open Modal
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            tab.classList.add('active');

            // Hide all contents
            linkContainers.forEach(c => c.classList.remove('active'));

            // Show target content
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });
});
