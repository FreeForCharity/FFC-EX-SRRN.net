
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
            
            // Toggle classes
            if (parent.classList.contains('et_pb_toggle_open')) {
                parent.classList.remove('et_pb_toggle_open');
                parent.classList.add('et_pb_toggle_close');
                // Slide Up
                content.style.display = 'none';
            } else {
                parent.classList.remove('et_pb_toggle_close');
                parent.classList.add('et_pb_toggle_open');
                // Slide Down
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
