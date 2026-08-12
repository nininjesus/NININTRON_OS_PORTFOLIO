document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const resultWrapper = document.getElementById("result-wrapper");
  const result = document.getElementById("result");

  if (form && resultWrapper && result) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.classList.add("was-validated");
      
      if (!form.checkValidity()) {
        const invalidElements = form.querySelectorAll(":invalid");
        if (invalidElements.length > 0) {
          invalidElements[0].focus();
        }
        return;
      }

      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);
      
      const msgSending = form.dataset.msgSending || "Enviando...";
      const msgError = form.dataset.msgError || "Algo salió mal. Intente de nuevo.";

      resultWrapper.classList.remove("success", "error");
      resultWrapper.classList.add("loading");
      result.textContent = msgSending;

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      })
        .then(async (response) => {
          try {
            let json = await response.json();
            resultWrapper.classList.remove("loading");
            if (response.ok) {
              resultWrapper.classList.add("success");
              result.textContent = json.message;
            } else {
              console.error(response);
              resultWrapper.classList.add("error");
              result.textContent = json.message;
            }
          } catch (error) {
            console.error("Error parsing response:", error);
            resultWrapper.classList.remove("loading");
            resultWrapper.classList.add("error");
            result.textContent = msgError;
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          resultWrapper.classList.remove("loading");
          resultWrapper.classList.add("error");
          result.textContent = msgError;
        })
        .then(function () {
          form.reset();
          form.classList.remove("was-validated");
          setTimeout(() => {
            resultWrapper.classList.remove("success", "error", "loading");
          }, 5000);
        });
    });
  }
}, { once: true });
