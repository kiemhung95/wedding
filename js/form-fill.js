// Function to show custom alert
function showCustomAlert(message, type = 'success') {
    const alert = document.getElementById('customAlert');
    alert.textContent = message;
    alert.className = `custom-alert ${type} show`;

    // Hide alert after 3 seconds
    setTimeout(() => {
        alert.className = 'custom-alert';
    }, 3000);
}

// RSVP: Show/hide conditional fields based on attendance selection
document.querySelectorAll('input[name="attendance"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        const rsvpDetails = document.getElementById('rsvpDetails');
        if (this.value === 'attending') {
            rsvpDetails.classList.add('show');
        } else {
            rsvpDetails.classList.remove('show');
            // Clear the conditional fields when switching to "not attending"
            document.getElementById('guestCount').value = '';
            document.getElementById('dietaryRequirements').value = '';
        }
    });
});

// Form submission handler
document.getElementById('message-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const relationship = document.getElementById('relationship').value;
    const message = document.getElementById('message').value;
    const attendanceEl = document.querySelector('input[name="attendance"]:checked');

    // Basic validation
    if (!name || !relationship || !message) {
        showCustomAlert('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    if (!attendanceEl) {
        showCustomAlert('Vui lòng cho mình biết bạn có thể tham dự không nhé!', 'error');
        return;
    }

    const attendance = attendanceEl.value;
    const formData = {
        name: name,
        relationship: relationship,
        message: message,
        attendance: attendance
    };

    // Include extra fields only when attending
    if (attendance === 'attending') {
        formData.guestCount = document.getElementById('guestCount').value || '';
        formData.dietaryRequirements = document.getElementById('dietaryRequirements').value || '';
    }

    fetch("https://script.google.com/macros/s/AKfycbzXKRcnMcbUkZW3G9jrZS7zeVPYWEm0k-tUcJlODzgAwDJtfkdMw8vilwys1Rux7b4b-A/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
    })
        .then(response => response.text())
        .then(data => showCustomAlert('Cảm ơn bạn đã gửi lời chúc! ❤️'))
        .catch(error => console.error("Error:", error));

    // Clear the form and hide RSVP details
    this.reset();
    document.getElementById('rsvpDetails').classList.remove('show');
});
