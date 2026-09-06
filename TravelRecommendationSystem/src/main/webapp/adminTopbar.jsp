<div class="topbar">
    <div class="d-flex align-items-center gap-3">
        <span class="menu-btn" id="menuBtn" title="Toggle Navigation Menu">
            <i class="fa-solid fa-bars"></i>
        </span>

        <div>
            <h3 id="adminPageTitle" style="font-family:'Outfit', sans-serif; font-weight:700; font-size:1.25rem; margin-bottom:2px; color:#0f172a;">
                Admin Control Center
            </h3>
            <small class="text-muted d-none d-sm-inline" id="adminPageSubtitle">
                TravelAI Management & Analytics
            </small>
        </div>
    </div>

    <div class="d-flex align-items-center gap-3">
        <div class="d-none d-md-flex align-items-center gap-2 px-3 py-1 rounded-pill" style="background:rgba(0,98,255,0.06); border:1px solid rgba(0,98,255,0.15); font-size:0.8rem; font-weight:600; color:#0062ff;">
            <span style="width:8px; height:8px; border-radius:50%; background:#10b981; display:inline-block; box-shadow:0 0 6px #10b981;"></span>
            <span>Live Server Active</span>
        </div>

        <div class="profile" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:6px 14px; display:flex; align-items:center; gap:8px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="width:32px; height:32px; border-radius:10px; background:linear-gradient(135deg, #8b5cf6, #ec4899); color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.85rem;">
                <i class="fa-solid fa-user-shield"></i>
            </div>
            <div>
                <div id="adminName" style="font-weight:700; font-size:0.86rem; color:#0f172a; line-height:1.2;">Admin</div>
                <small class="text-muted d-none d-sm-block" style="font-size:0.72rem;">Administrator</small>
            </div>
        </div>
    </div>
</div>

<script>
(function() {
    const email = localStorage.getItem("adminEmail") || "Administrator";
    const nameEl = document.getElementById("adminName");
    if (nameEl) {
        nameEl.textContent = email.split("@")[0];
    }
})();
</script>