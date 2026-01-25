const input = document.getElementById("imgInput"); // Matched to HTML
const preview = document.getElementById("preview");
const resultDiv = document.getElementById("result");

input.onchange = () => {
    if (input.files.length > 0) {
        preview.src = URL.createObjectURL(input.files[0]);
        resultDiv.innerHTML = ""; // Clear old results when new image is picked
    }
};

async function analyzeImage() {
    if (!input.files.length) {
        alert("Please upload or capture an image");
        return;
    }

    // 1. Show Loading State
    resultDiv.innerHTML = `<p style="color: #f4b400;"><b>Scanning image for anomalies...</b></p>`;
    
    // 2. Simulate Network/AI Delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Logic: Random Selection (Mocking an AI's decision)
    const possibilities = [
        { 
            name: "Varroa Mites", 
            conf: "82%", 
            actions: ["Check bottom board", "Apply formic acid treatment", "Inspect drone brood"] 
        },
        { 
            name: "Healthy Hive", 
            conf: "95%", 
            actions: ["No action needed", "Continue regular monitoring"] 
        },
        { 
            name: "American Foulbrood (AFB)", 
            conf: "61%", 
            actions: ["Isolate hive immediately", "Contact state inspector", "Do not share tools"] 
        }
    ];

    const pick = possibilities[Math.floor(Math.random() * possibilities.length)];

    // 4. Update UI
    resultDiv.innerHTML = `
        <hr>
        <div style="animation: fadeIn 0.5s;">
            <b>🧠 Prediction:</b> ${pick.name}<br>
            <b>Confidence:</b> ${pick.conf}<br><br>
            <b>Recommended Actions:</b>
            <ul id="actionList"></ul>
        </div>
    `;

    const list = document.getElementById("actionList");
    pick.actions.forEach(text => {
        const li = document.createElement("li");
        li.innerText = text;
        list.appendChild(li);
    });
}