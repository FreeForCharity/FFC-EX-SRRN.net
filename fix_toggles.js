
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixing toggles...");
    var toggles = document.querySelectorAll('.et_pb_toggle_title');
    
    toggles.forEach(function(toggle) {
        // Remove cloned event listeners if any (simple hack: clone node)
        // Actually, just binding new click should remain simple.
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default if it's a link
            
            var parent = this.parentElement;
            var content = parent.querySelector('.et_pb_toggle_content');
            var isCurrentlyOpen = parent.classList.contains('et_pb_toggle_open');
            
            // Close all toggles first (accordion behavior)
            toggles.forEach(function(otherToggle) {
                var otherParent = otherToggle.parentElement;
                var otherContent = otherParent.querySelector('.et_pb_toggle_content');
                otherParent.classList.remove('et_pb_toggle_open');
                otherParent.classList.add('et_pb_toggle_close');
                otherContent.style.display = 'none';
            });
            
            // If the clicked toggle was closed, open it
            if (!isCurrentlyOpen) {
                parent.classList.remove('et_pb_toggle_close');
                parent.classList.add('et_pb_toggle_open');
                content.style.display = 'block';
            }
        });
        
        // Ensure initial state matches class
        var parent = toggle.parentElement;
        var content = parent.querySelector('.et_pb_toggle_content');
        if (parent.classList.contains('et_pb_toggle_close')) {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    });
});
