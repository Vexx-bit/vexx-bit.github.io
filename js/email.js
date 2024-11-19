//emailingService
function SendMail() {
    var params = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        email: document.getElementById('email').value,
        budget: document.getElementById('budget').value,
        message: document.getElementById('message').value
    };

    emailjs.send("service_9p3o2fn", "template_k3c2mno", params).then(function(res) {
        console.log("Success!", res.status); // Log success status
        alert("Your message has been sent successfully!"); // Alert success message
    }).catch(function(error) {
        console.error("Failed to send email:", error); // Log error
        alert("Failed to send email: " + error); // Alert error
    });
    window.onbeforeunload = function() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.reset(); // Reset the form inputs
        }
    };
}