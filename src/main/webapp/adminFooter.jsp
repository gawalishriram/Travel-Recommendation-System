<footer class="admin-footer">

    <h5>

        <i class="fa-solid fa-plane-departure me-2"></i>

        TravelAI Admin Panel

    </h5>

    <p>
        Manage users and destinations from one place.
    </p>

    <p class="mb-0">

        &copy;

        <span id="footerYear"></span>

        TravelAI. All rights reserved.

    </p>

</footer>


<script>

document.addEventListener("DOMContentLoaded", function () {

    const footerYear =
        document.getElementById("footerYear");

    if (footerYear) {

        footerYear.textContent =
            new Date().getFullYear();

    }


    const menuBtn =
        document.getElementById("menuBtn");

    const sidebar =
        document.getElementById("adminSidebar");

    const overlay =
        document.getElementById("sidebarOverlay");


    if (menuBtn && sidebar) {

        menuBtn.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle("active");

                if (overlay) {
                    overlay.classList.toggle("active");
                }

            }
        );

    }


    if (overlay && sidebar) {

        overlay.addEventListener(
            "click",
            function () {

                sidebar.classList.remove("active");

                overlay.classList.remove("active");

            }
        );

    }

});

</script>