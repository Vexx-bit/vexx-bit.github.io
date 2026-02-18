document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // ─── Cloudflare Turnstile verification ───
    const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]');
    if (!turnstileResponse || !turnstileResponse.value) {
      showNotification(
        'Verification Required',
        'Please complete the verification challenge before sending.',
        'error'
      );
      return;
    }
    
    // Show loading state
    const submitButton = this.querySelector('.btn-submit');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Add timestamp
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    // Prepare template parameters
    const templateParams = {
      name: document.getElementById('user_name').value,
      email: document.getElementById('user_email').value,
      message: document.getElementById('message').value,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      timestamp: timestamp
    };
    
    // Send email
    emailjs.send(
      'service_x565foy',
      'template_fww2gmf',
      templateParams
    )
    .then(function() {
      // Show success notification
      showNotification(
        'Message Sent!', 
        'Your message has been delivered successfully. We\'ll get back to you soon.', 
        'success'
      );
      
      // Reset form
      document.getElementById('contact-form').reset();
      if (typeof turnstile !== 'undefined') turnstile.reset();
    }, function(error) {
      // Show error notification
      console.error('EmailJS error:', error);
      showNotification(
        'Message Failed', 
        'There was a problem sending your message. Please try again later.', 
        'error'
      );
      if (typeof turnstile !== 'undefined') turnstile.reset();
    })
    .finally(function() {
      // Restore button state
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    });
  });
  
  // Notification system
  function showNotification(title, message, type = 'success') {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.getElementById('notification');
    const notificationTitle = document.getElementById('notification-title');
    const notificationMessage = document.getElementById('notification-message');
    const notificationClose = document.getElementById('notification-close');
    
    // Set notification content
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    // Set notification type
    notification.className = 'notification ' + type;
    
    // Show notification
    notificationContainer.classList.add('show');
    
    // Auto hide after 5 seconds
    const timer = setTimeout(() => {
      hideNotification();
    }, 5000);
    
    // Close button event
    notificationClose.onclick = function() {
      hideNotification();
      clearTimeout(timer);
    };
    
    function hideNotification() {
      notificationContainer.classList.remove('show');
    }
  }