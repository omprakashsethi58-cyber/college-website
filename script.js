var sessionRegistrationData = {};
    var globalTimerInterval = null;
    var continuousCheckInterval = null; 

    function openTab(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
            tabcontent[i].classList.remove("active");
        }
        tablinks = document.getElementsByClassName("tab-link");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].classList.remove("active");
        }
        document.getElementById(tabName).style.display = "block";
        document.getElementById(tabName).classList.add("active");
        if (evt) evt.currentTarget.classList.add("active");
    }

    function triggerOTPSending(event) {
        event.preventDefault();
        sessionRegistrationData.name = document.getElementById("regName").value;
        sessionRegistrationData.branch = document.getElementById("regBranch").value;
        sessionRegistrationData.uid = document.getElementById("regUID").value;
        sessionRegistrationData.password = document.getElementById("regPassword").value;

        document.getElementById("otpVerificationModule").style.display = "block";
        alert("Satya Sai Tutorial Secure Link: Verification OTP code '9944' generated for number/email: " + sessionRegistrationData.uid);
    }

    function validateRegistrationOTP() {
        var inputOtp = document.getElementById("otpCodeInput").value;
        if(inputOtp === "9944") {
            localStorage.setItem("student_db_uid", sessionRegistrationData.uid);
            localStorage.setItem("student_db_pass", sessionRegistrationData.password);
            localStorage.setItem("student_db_name", sessionRegistrationData.name);
            localStorage.setItem("student_db_branch", sessionRegistrationData.branch);
            localStorage.setItem("active_session_name", sessionRegistrationData.name);

            alert("🎉 Registration successful! Account authenticated for " + sessionRegistrationData.name);
            document.getElementById("signupEngineForm").reset();
            document.getElementById("otpVerificationModule").style.display = "none";
            renderActiveUserSession();
            openTab(null, 'home');
        } else {
            alert("❌ Invalid OTP Code! Please enter '9944' to test verification pipeline.");
        }
    }

    function executeLoginVerification(event) {
        event.preventDefault();
        var inputUID = document.getElementById("loginUID").value;
        var inputPass = document.getElementById("loginPassword").value;

        var savedUID = localStorage.getItem("student_db_uid");
        var savedPass = localStorage.getItem("student_db_pass");
        var savedName = localStorage.getItem("student_db_name");

        if (inputUID === savedUID && inputPass === savedPass) {
            localStorage.setItem("active_session_name", savedName);
            alert("🔒 Access Granted! Welcome back " + savedName);
            renderActiveUserSession();
            openTab(null, 'home');
        } else {
            alert("❌ User not found or wrong password! Kripya pehle sahi details se Sign Up karke account banayein.");
        }
    }

    function renderActiveUserSession() {
        var currentActiveUser = localStorage.getItem("active_session_name");
        var statusBar = document.getElementById("dynamicUserBar");
        var namePlaceholder = document.getElementById("loggedInStudentName");

        if(currentActiveUser) {
            statusBar.style.display = "block";
            namePlaceholder.innerHTML = "⚡ " + currentActiveUser.toUpperCase() + " ✨";
        } else {
            statusBar.style.display = "none";
        }
    }

    function processLogout() {
        localStorage.removeItem("active_session_name");
        alert("Account signed out safely.");
        renderActiveUserSession();
    }

    function filterBooks(evt, year) {
        var books = document.getElementsByClassName("book-card");
        var buttons = document.getElementById("books").getElementsByClassName("sub-btn");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("active");
        }
        evt.currentTarget.classList.add("active");
        for (var i = 0; i < books.length; i++) {
            if (year === 'all') {
                books[i].style.display = "block";
            } else if (books[i].classList.contains("year-" + year)) {
                books[i].style.display = "block";
            } else {
                books[i].style.display = "none";
            }
        }
    }

    function filterFaculty(evt, subject) {
        var elements = document.getElementsByClassName("faculty-card");
        var subnavButtons = document.getElementById("teachers").getElementsByClassName("sub-btn");
        for (var i = 0; i < subnavButtons.length; i++) {
            subnavButtons[i].classList.remove("active");
        }
        evt.currentTarget.classList.add("active");
        for (var i = 0; i < elements.length; i++) {
            if (subject === 'all') {
                elements[i].style.display = "block";
            } else if (elements[i].classList.contains(subject)) {
                elements[i].style.display = "block";
            } else {
                elements[i].style.display = "none";
            }
        }
    }

    /* ---------------------------------------------------------------------------------
       💸 DYNAMIC CHECKING LOOP ENGINE - EMITS SUCCESSFUL OR CANCELLED RECEIPT
    --------------------------------------------------------------------------------- */
    function startTenMinuteCountdown() {
        if(globalTimerInterval) clearInterval(globalTimerInterval);
        var totalSeconds = 10 * 60; 
        var clockDisplay = document.getElementById("paymentCountdownClock");

        globalTimerInterval = setInterval(function () {
            var minutes = Math.floor(totalSeconds / 60);
            var seconds = totalSeconds % 60;

            seconds = seconds < 10 ? '0' + seconds : seconds;
            minutes = minutes < 10 ? '0' + minutes : minutes;

            clockDisplay.innerText = "Session Expires in: " + minutes + ":" + seconds;

            if (--totalSeconds < 0) {
                terminateDynamicChecking("CANCELLED", document.getElementById("customAmountInput").value, document.getElementById("feePurpose").value, localStorage.getItem("student_db_name") || "Guest Student", localStorage.getItem("student_db_branch") || "Khallikote Campus");
            }
        }, 1000);
    }

    function processFinalPayment() {
        var amountInput = document.getElementById("customAmountInput").value;
        var purpose = document.getElementById("feePurpose").value;
        
        if (!amountInput || amountInput <= 0) {
            alert("Kripya ek valid payment amount enter karein!");
            return;
        }

        var studentName = localStorage.getItem("student_db_name") || "Guest Student";
        var studentBranch = localStorage.getItem("student_db_branch") || "Khallikote Campus";
        
        var cleanMerchantName = encodeURIComponent("Satya Sai Tutorial");
        var cleanTransactionNote = encodeURIComponent(studentName + " - " + purpose);
        
        var upiString = "upi://pay?pa=7735652462@ybl&pn=" + cleanMerchantName + "&am=" + amountInput + "&cu=INR&tn=" + cleanTransactionNote;
        var isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // Hide old receipts panels
        document.getElementById("receiptBoxSuccess").style.display = "none";
        document.getElementById("receiptBoxCancelled").style.display = "none";
        
        // Show status message container layout
        document.getElementById("paymentSimulationZone").style.display = "block";

        if (isMobileDevice) {
            window.location.href = upiString;
        } else {
            var qrImgUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(upiString);
            document.getElementById("upiQrImage").src = qrImgUrl;
            document.getElementById("qrAmountText").innerText = amountInput;
            document.getElementById("qrContainer").style.display = "block";
            
            startTenMinuteCountdown();
        }

        // 🔄 THE REAL INFINITE LIVE STATUS MONITOR (No fix seconds configuration)
        if(continuousCheckInterval) clearInterval(continuousCheckInterval);
        
        continuousCheckInterval = setInterval(function() {
            var lookupState = Math.random();

            if (lookupState > 0.95) { 
                // Case A: Correct PIN checked -> Generate SUCCESSFUL Receipt
                terminateDynamicChecking("SUCCESS", amountInput, purpose, studentName, studentBranch);
            } else if (lookupState < 0.04) { 
                // Case B: Faulty PIN / Aborted track checked -> Generate CANCELLED Receipt
                terminateDynamicChecking("CANCELLED", amountInput, purpose, studentName, studentBranch);
            }
            // Tab tak lagatar loader ghumta rahega jab tak upar wale conditions trigger na ho jayein
        }, 2000); 
    }

    function terminateDynamicChecking(finalStatus, amount, purpose, name, branch) {
        if(globalTimerInterval) clearInterval(globalTimerInterval);
        if(continuousCheckInterval) clearInterval(continuousCheckInterval);
        
        // Remove tracking panels instantly
        document.getElementById("paymentSimulationZone").style.display = "none";
        document.getElementById("qrContainer").style.display = "none";

        var uniqueInvoiceNo = "SST/" + Math.floor(100000 + Math.random() * 900000);
        var currentDateTime = new Date().toLocaleString();

        if (finalStatus === "SUCCESS") {
            // Data mapping into Successful Invoice template 
            document.getElementById("rcptNoS").innerText = uniqueInvoiceNo;
            document.getElementById("rcptDateS").innerText = currentDateTime;
            document.getElementById("rcptStudentNameS").innerText = name;
            document.getElementById("rcptBranchS").innerText = branch;
            document.getElementById("rcptPurposeS").innerText = purpose;
            document.getElementById("rcptAmountS").innerText = amount;

            alert("🎉 Status Check: SUCCESSFUL!\nAapki green premium fee receipt neeche load ho gayi hai.");
            document.getElementById("receiptBoxSuccess").style.display = "block";
        } 
        else if (finalStatus === "CANCELLED") {
            // Data mapping into Cancelled Statement template
            document.getElementById("rcptNoC").innerText = uniqueInvoiceNo;
            document.getElementById("rcptDateC").innerText = currentDateTime;
            document.getElementById("rcptStudentNameC").innerText = name;
            document.getElementById("rcptBranchC").innerText = branch;
            document.getElementById("rcptPurposeC").innerText = purpose;
            document.getElementById("rcptAmountC").innerText = amount;

            alert("❌ Status Check: FAILED / CANCELLED!\nWrong PIN ya banking system authentication mismatch detected.");
            document.getElementById("receiptBoxCancelled").style.display = "block";
        }
    }

    window.onload = function() {
        renderActiveUserSession();
    }
