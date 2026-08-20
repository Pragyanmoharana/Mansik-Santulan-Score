
console.log("SCRIPT IS WORKING");
const sliders = [
    ["Sleep_Hours_Per_Night", "sleepValue", " hrs"],
    ["Study_Hours", "studyValue", " hrs"],
    ["Physical_Activity_Hours", "activityValue", " hrs"],
    ["Stress_Level", "stressValue", ""],
    ["Avg_Daily_Usage_Hours", "usageValue", " hrs"]
];


// ===============================
// SLIDER VALUES
// ===============================

sliders.forEach(function (item) {

    const slider = document.getElementById(item[0]);
    const display = document.getElementById(item[1]);

    if (slider && display) {

        slider.addEventListener("input", function () {
            display.textContent = slider.value + item[2];
        });

    }

});


// ===============================
// PREDICTION
// ===============================

document.getElementById("predictBtn").addEventListener(
    "click",
    async function () {

        const button = document.getElementById("predictBtn");

        button.textContent = "Predicting...";
        button.disabled = true;


        // ===============================
        // COLLECT FORM DATA
        // ===============================

        const data = {

            Study_Hours:
                parseFloat(
                    document.getElementById("Study_Hours").value
                ),

            Age:
                parseFloat(
                    document.getElementById("Age").value
                ),

            Avg_Daily_Usage_Hours:
                parseFloat(
                    document.getElementById("Avg_Daily_Usage_Hours").value
                ),

            Daily_Unlocks:
                parseFloat(
                    document.getElementById("Daily_Unlocks").value
                ),

            Physical_Activity_Hours:
                parseFloat(
                    document.getElementById("Physical_Activity_Hours").value
                ),

            Sleep_Hours_Per_Night:
                parseFloat(
                    document.getElementById("Sleep_Hours_Per_Night").value
                ),

            Stress_Level:
                parseFloat(
                    document.getElementById("Stress_Level").value
                ),

            Gender:
                document.getElementById("Gender").value,

            Academic_Level:
                document.getElementById("Academic_Level").value,

            Most_Used_Platform:
                document.getElementById("Most_Used_Platform").value,

            Purpose_Of_Use:
                document.getElementById("Purpose_Of_Use").value,

            Grouped_Country:
                document.getElementById("Grouped_Country").value
        };


        console.log("Sending data to Django:");
        console.log(data);


        // ===============================
        // SEND REQUEST
        // ===============================

        try {

            const response = await fetch("/predict/", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });


            console.log("Response status:", response.status);


            // ===============================
            // READ RESPONSE SAFELY
            // ===============================

            const responseText = await response.text();

            console.log("Raw Django response:");
            console.log(responseText);


            let result;

            try {

                result = JSON.parse(responseText);

            } catch (jsonError) {

                result = {
                    error: responseText
                };

            }


            console.log("Django response:", result);


            // ===============================
            // SUCCESS
            // ===============================

            if (response.ok) {

                const prediction =
                    Number(result.prediction);


                if (Number.isNaN(prediction)) {

                    document.getElementById("status").textContent =
                        "ERROR";

                    document.getElementById("message").textContent =
                        "Django did not return a valid prediction.";

                    console.error(
                        "Invalid prediction:",
                        result
                    );

                    return;
                }


                document.getElementById("score").textContent =
                    prediction.toFixed(2);


                document.getElementById("status").textContent =
                    "PREDICTION COMPLETE";


                document.getElementById("message").textContent =
                    "Your estimated mental health score is " +
                    prediction.toFixed(2) +
                    " out of 10.";

            }


            // ===============================
            // DJANGO ERROR
            // ===============================

            else {

                document.getElementById("status").textContent =
                    "PREDICTION ERROR";


                document.getElementById("message").textContent =
                    "The Django/ML backend returned an error. " +
                    "Check the terminal for details.";


                console.error(
                    "Django returned error:",
                    result
                );

            }

        }


        // ===============================
        // REAL CONNECTION ERROR
        // ===============================

        catch (error) {

            console.error(
                "Actual connection error:",
                error
            );


            document.getElementById("status").textContent =
                "CONNECTION ERROR";


            document.getElementById("message").textContent =
                "The browser could not reach the Django server.";

        }


        // ===============================
        // RESET BUTTON
        // ===============================

        button.textContent =
            "Predict my score";

        button.disabled = false;

    }
);