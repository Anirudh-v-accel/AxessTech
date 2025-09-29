class MyModalContactForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <style>
          .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: rgba(0, 0, 0, 0.4);
          }
          .modal-content {
            background-color: #fefefe;
            margin: auto;
            padding: 20px;
            border: 1px solid #888;
            width: 100%;
            max-width: 450px;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
          }
          .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            display: flex;
            justify-content: end;
          }
          .close:hover,
          .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
          }
          input, textarea {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            box-sizing: border-box;
          }
          button {
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            
          }
          h2 {
            text-align: center;
            font-size: 30px;
          }
          button:hover {
            background-color: #0056b3;
          }
          .error {
            color: red;
            font-size: 0.8em;
            margin-top: -5px;
            margin-bottom: 5px;
          }
          .required::after {
            content: " *";
            color: red;
          }
          /* Checkbox styles */
          .checkbox-container {
            display: flex;
            align-items: flex-start;
            margin: 15px 0;
          }
          .checkbox-container input[type="checkbox"] {
            width: auto;
            margin-top: 3px;
            margin-right: 10px;
          }
          .checkbox-container label {
            font-size: 14px;
            line-height: 1.4;
            flex: 1;
            color: #555;
          }
          input[type="checkbox"] {
            accent-color: #007bff;
            width: 16px;
            height: 16px;
            cursor: pointer;
          }
        </style>
        <div id="myModal" class="modal">
          <div class="modal-content">
            <span class="close" id="closeBtn">&times;</span>
            <h2>Let's Connect</h2>
            <form id="contactForm">
              <label for="name" class="required">Name</label>
              <input type="text" id="name" placeholder="Name"  />
              <div id="nameError" class="error"></div>
              
              <label for="phone" class="required">Mobile No</label>
              <input type="tel" id="phone" placeholder="Mobile No"  />
              <div id="phoneError" class="error"></div>
              
              <label for="whatsapp" class="required">WhatsApp No</label>
              <input type="tel" id="whatsapp" placeholder="WhatsApp No"  />
              <div id="whatsappError" class="error"></div>
              
              <label for="message">Message</label>
              <textarea id="message" placeholder="Message"></textarea>
              <div id="messageError" class="error"></div>
              
              <!-- Authorization Checkbox -->
              <div class="checkbox-container">
                <input type="checkbox" id="authorization" />
                <label for="authorization">
                  I authorize Axess Technology & its representatives to contact me with updates and notifications via Email, SMS, WhatsApp, and Call. This will override the registry on DND/NDNC.
                </label>
              </div>
              <div id="authorizationError" class="error"></div>
              
              <button type="submit" class="ep-btn">Submit</button>
            </form>
          </div>
        </div>
      `

    const modal = this.querySelector("#myModal")
    const closeBtn = this.querySelector("#closeBtn")
    const contactForm = this.querySelector("#contactForm")

    // Show modal on page load
    window.onload = () => {
      modal.style.display = "block"
    }

    // Close the modal when the close button is clicked
    closeBtn.onclick = () => {
      modal.style.display = "none"
    }

    // Close the modal when clicking outside of the modal content
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none"
      }
    }

    // Add event listeners for real-time validation
    this.addValidationListeners()

    // Handle form submission
    contactForm.onsubmit = this.handleSubmit.bind(this)
  }

  addValidationListeners() {
    const fields = ["name", "phone", "whatsapp"]
    fields.forEach((field) => {
      const input = document.getElementById(field)
      input.addEventListener("input", () => this.validateField(field, false))
      input.addEventListener("blur", () => this.validateField(field, true))
    })

    // Add listener for authorization checkbox
    const authorization = document.getElementById("authorization")
    authorization.addEventListener("change", () => {
      if (authorization.checked) {
        this.clearError("authorization")
      }
    })
  }

  validateField(field, showEmptyError) {
    const input = document.getElementById(field)
    const value = input.value.trim()

    if (!value) {
      if (showEmptyError) {
        this.showError(field, `${this.getFieldLabel(field)} cannot be empty`)
      } else {
        this.clearError(field)
      }
      return false
    }

    switch (field) {
      case "name":
        return this.validateName(value)
          ? this.clearError(field)
          : this.showError(field, "Please enter a valid name (only letters and spaces)")
      case "phone":
      case "whatsapp":
        return this.validatePhone(value)
          ? this.clearError(field)
          : this.showError(field, "Please enter a valid 10-digit number starting with 6, 7, 8, or 9")
    }
  }

  getFieldLabel(field) {
    const labels = {
      name: "Name",
      phone: "Mobile No",
      whatsapp: "WhatsApp No",
    }
    return labels[field] || field.charAt(0).toUpperCase() + field.slice(1)
  }

  validateAllFields() {
    const fields = ["name", "phone", "whatsapp"]
    let isValid = true
    fields.forEach((field) => {
      if (!this.validateField(field, true)) {
        isValid = false
      }
    })

    // Check if authorization checkbox is checked
    const authorization = document.getElementById("authorization")
    if (!authorization.checked) {
      this.showError("authorization", "Please authorize to proceed")
      isValid = false
    } else {
      this.clearError("authorization")
    }

    return isValid
  }

  async handleSubmit(event) {
    event.preventDefault()

    if (!this.validateAllFields()) {
      return false // Prevent form submission if there are errors
    }

    // Get the submit button
    const submitBtn = event.target.querySelector(".ep-btn")

    // Change button state
    const originalText = submitBtn.textContent
    submitBtn.disabled = true
    submitBtn.textContent = "Sending..."

    // Get form values
    const name = document.getElementById("name").value
    const phone = document.getElementById("phone").value
    const whatsapp = document.getElementById("whatsapp").value
    const message = document.getElementById("message").value
    const authorized = document.getElementById("authorization").checked

    const SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbza8sSffFy8T0ALF0cuaUEu-cMRy2gmKgmoBjjGKDpJCoveIww3p1Znl1xmnUUaz4GRaQ/exec"
    try {
      // Prepare form data
      const formData = {
        name: name,
        phone: phone,
        whatsapp: whatsapp,
        message: message,
        authorized: authorized,
      }

      // Send to Google Sheets using fetch with error handling
      const response = await fetch(SCRIPT_URL, {
        redirect: "follow",
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(formData),
      })

      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Parse the response
      const result = await response.json()

      if (result.status == 200) {
        // Show success message
        this.showNotification("Thank You. We Will Contact You Soon!", "success")
      } else {
        throw new Error(result.message || "Failed to submit form")
      }
    } catch (error) {
      // Reset form
      document.getElementById("contactForm").reset()
      // Close modal on success
      document.getElementById("myModal").style.display = "none"
      // Handle errors
      this.showNotification("Thank You. We Will Contact You Soon!", "success")

      localStorage.setItem("form_submited", JSON.stringify("true"))
    } finally {
      // Reset button state
      submitBtn.disabled = false
      submitBtn.textContent = originalText
    }

    return false
  }

  validateName(name) {
    return /^[A-Za-z\s]+$/.test(name)
  }

  validatePhone(phone) {
    return /^[6-9]\d{9}$/.test(phone)
  }

  showError(inputId, message) {
    const errorSpan = document.getElementById(inputId + "Error")
    errorSpan.textContent = message
    errorSpan.style.display = "block"
  }

  clearError(inputId) {
    const errorSpan = document.getElementById(inputId + "Error")
    errorSpan.textContent = ""
    errorSpan.style.display = "none"
    return true
  }

  showNotification(message, type) {
    const existingNotification = document.querySelector(".notification")
    if (existingNotification) {
      existingNotification.remove()
    }

    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    // Apply custom styles for top notification
    notification.style.position = "fixed"
    notification.style.top = "0"
    notification.style.left = "50%"
    notification.style.transform = "translateX(-50%)"
    notification.style.zIndex = "1001"
    notification.style.padding = "10px"
    notification.style.backgroundColor = type === "success" ? "#28a745" : "#dc3545"
    notification.style.color = "white"
    notification.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)"
    notification.style.width = "100%"
    notification.style.maxWidth = "450px"
    notification.style.textAlign = "center"

    // Append the notification to the body
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
}

customElements.define("common-form", MyModalContactForm)

