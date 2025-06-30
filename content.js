let studentsList = [];
let currentIndex = 0;
let keyboardHintDiv;


(function waitForContainer() {
    const container = document.getElementById('kt_app_content_container');
    if (!container) {
        setTimeout(waitForContainer, 300);
        return;
    }
    insertPanel(container);

    monitorExactClassSelectChange(); // Start observing
})();

function insertPanel(container) {
    container.style.maxWidth = '100%';
    container.style.padding = '0';
    container.style.margin = '0';
    container.style.width = '100%';
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    container.style.gap = '10px';

    const cardBody = container.querySelector('.card-body');
    cardBody.style.boxSizing = 'border-box';

    if (document.getElementById('myCustomGreenDiv')) return;

    const newCard = document.createElement('div');
    newCard.className = 'card card-custom h-100';
    newCard.id = 'myCustomGreenDiv';

    const newCardBody = document.createElement('div');
    newCardBody.className = 'card-body';

    // Fixed positioning but with responsive calculations
    newCardBody.style.position = 'fixed';
    newCardBody.style.top = '145px';
    newCardBody.style.right = '20px';
    newCardBody.style.height = '75vh';
    newCardBody.style.minHeight = '500px';
    newCardBody.style.maxHeight = '85vh';

    // Responsive width - will be updated by JavaScript function
    newCardBody.style.width = '300px'; // Default width
    newCardBody.style.minWidth = '250px';
    newCardBody.style.maxWidth = '450px';

    newCardBody.style.backgroundColor = '#f9f9f9';
    newCardBody.style.color = '#333';
    newCardBody.style.boxSizing = 'border-box';
    newCardBody.style.padding = '20px';
    newCardBody.style.display = 'flex';
    newCardBody.style.flexDirection = 'column';
    newCardBody.style.justifyContent = 'space-between';
    newCardBody.style.borderRadius = '8px';
    newCardBody.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';

    // Add responsive behavior for small screens
    newCardBody.style.zIndex = '1000';

    // Student card container
    const studentCardDiv = document.createElement('div');
    studentCardDiv.id = 'studentCardDiv';
    studentCardDiv.style.flexGrow = '1';
    studentCardDiv.style.overflowY = 'auto';
    studentCardDiv.style.overflowX = 'auto';
    studentCardDiv.style.display = 'flex';
    studentCardDiv.style.alignItems = 'center';
    studentCardDiv.style.justifyContent = 'center';
    studentCardDiv.style.flexDirection = 'column';

    // Start Button Wrapper (only if not already created)
    if (!document.getElementById("startBtnWrapper")) {
        const startBtnWrapper = document.createElement("div");
        startBtnWrapper.id = "startBtnWrapper";
        startBtnWrapper.style.display = "flex";
        startBtnWrapper.style.justifyContent = "center";
        startBtnWrapper.style.alignItems = "center";
        startBtnWrapper.style.height = "100%";

        const startBtn = document.createElement("button");
        startBtn.className = "btn btn-success";
        startBtn.innerHTML = `<i class="bi bi-play-circle me-1"></i> Start Attendance`;
        startBtn.onclick = () => {
            const table = document.querySelector('.card-body table');
            if (!table) {
                alert("Student table not found. Make sure the list is visible.");
                return;
            }
            startBtn.disabled = true;
            startBtn.innerText = "Starting...";
            extractStudents();
            currentIndex = 0;
            renderCard();
            window.addEventListener('keydown', handleKeyDown);

            startBtnWrapper.remove();
            document.querySelector(".d-flex.mt-4, .d-flex.flex-wrap.mt-4")?.classList.remove("d-none");
        };

        startBtnWrapper.appendChild(startBtn);

        // Header (put immediately after newCardBody is created)
        const header = document.createElement("div");
        header.style.fontWeight = "bold";
        header.style.textAlign = "center";
        header.style.marginBottom = "10px";
        header.style.fontSize = "16px";
        header.innerHTML = `📘 BRACU Connect Attendance Helper`;

        newCardBody.appendChild(header);
        newCardBody.appendChild(startBtnWrapper);
    }



    // Action Buttons (initially hidden)
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "d-flex flex-wrap justify-content-center gap-3 mt-4 d-none";

    const resetBtn = document.createElement("button");
    resetBtn.className = "btn btn-secondary";
    resetBtn.innerHTML = `<i class="bi bi-arrow-repeat me-1"></i> Reset`;
    resetBtn.onclick = () => {
        studentsList.forEach(s => {
            const radios = s.row.querySelectorAll('input[type="radio"]');
            if (radios.length >= 2) {
                radios[0].checked = false;
                radios[1].checked = false;
            }
            s.status = undefined;
        });
        currentIndex = 0;
        renderCard();
    };

    const copyBtn = document.createElement("button");
    copyBtn.className = "btn d-flex align-items-center justify-content-center";
    copyBtn.style.backgroundColor = "#5b9bd5";
    copyBtn.style.color = "#fff";
    copyBtn.style.border = "none";
    copyBtn.style.padding = "10px 16px";
    copyBtn.style.fontWeight = "500";
    copyBtn.style.transition = "background-color 0.3s ease";
    copyBtn.innerHTML = `<i class="bi bi-clipboard-check me-1" style="color: white;"></i> Copy Full Report`;

    copyBtn.onmouseover = () => {
        copyBtn.style.backgroundColor = "#498ecb";
    };
    copyBtn.onmouseleave = () => {
        copyBtn.style.backgroundColor = "#5b9bd5";
    };

    copyBtn.onclick = () => {
        let classDate = "Attendance";
        try {
            const allFields = document.querySelectorAll('formly-field');
            for (const field of allFields) {
                if (field.innerText.includes('Class')) {
                    const span = field.querySelector('.mat-mdc-select-value-text span');
                    if (span && span.innerText.includes('-')) {
                        const match = span.innerText.match(/\d{2}-\d{2}-\d{4}/);
                        if (match) classDate = match[0];
                        break;
                    }
                }
            }
        } catch (err) {
            console.warn("Could not find class date:", err);
        }

        let text = `ID\tName\t${classDate}\n`;
        studentsList.forEach(s => {
            const radios = s.row.querySelectorAll('input[type="radio"]');
            if (radios[0].checked) s.status = 'Present';
            else if (radios[1].checked) s.status = 'Absent';
            else s.status = undefined;

            text += `${s.id}\t${s.name}\t${s.status || "Not marked"}\n`;
        });

        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `<i class="bi bi-check2-circle me-1"></i> Copied!`;
            copyBtn.disabled = true;
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.disabled = false;
            }, 1500);
        });
    };

    buttonContainer.appendChild(copyBtn);
    buttonContainer.appendChild(resetBtn);

    keyboardHintDiv = document.createElement("div");
    keyboardHintDiv.className = "text-muted text-center mb-2";
    keyboardHintDiv.style.fontSize = "13px";
    keyboardHintDiv.title = "Keyboard Shortcut";
    keyboardHintDiv.style.display = "none";
    keyboardHintDiv.innerHTML = `Press <b>←</b> for Absent &nbsp;&nbsp;|&nbsp;&nbsp; <b>→</b> for Present`;

    newCardBody.appendChild(keyboardHintDiv);
    newCardBody.appendChild(studentCardDiv);
    newCardBody.appendChild(buttonContainer);

    const footer = document.createElement("div");
    footer.className = "text-center mt-3 text-muted";
    footer.style.fontSize = "11px";
    footer.style.opacity = "0.7";
    footer.innerHTML = `👨‍💻 Created by Md. Khaliduzzaman Khan Samrat - KKS`;
    newCardBody.appendChild(footer);

    newCard.appendChild(newCardBody);
    document.body.appendChild(newCard);

    setTimeout(() => {
        updatePanelWidth();
        adjustMainContentWidth();
    }, 500);

    window.addEventListener('resize', () => {
        updatePanelWidth();
        adjustMainContentWidth();
    });

    injectStyles();
}

function hookSaveButtonToCopy() {
    const buttons = document.querySelectorAll('button.btn.btn-primary[type="submit"]');

    let saveBtn = null;
    for (const btn of buttons) {
        if (btn.textContent.trim().toLowerCase().includes('save')) {
            saveBtn = btn;
            break;
        }
    }

    if (!saveBtn) {
        console.log('[Attendance Helper] Save button not found, retrying...');
        setTimeout(hookSaveButtonToCopy, 500);
        return;
    }

    if (saveBtn.dataset.copyHooked) return;

    saveBtn.dataset.copyHooked = "true";

    saveBtn.addEventListener('click', () => {
        console.log('[Attendance Helper] Save clicked — triggering attendance copy');

        const copyBtn = document.querySelector('.btn:has(.bi-clipboard-check)');
        if (copyBtn) {
            copyBtn.click();
        } else {
            console.warn('[Attendance Helper] Copy button not found.');
        }
    });
}

// Add this new function to handle responsive width calculation
function updatePanelWidth() {
    const panel = document.querySelector('#myCustomGreenDiv .card-body');
    if (!panel) return;

    const screenWidth = window.innerWidth;
    let panelWidth;

    if (screenWidth >= 1400) {
        // Large screens: 23% of viewport width
        panelWidth = Math.min(Math.max(screenWidth * 0.27, 300), 450);
        panel.style.right = '20px';
        panel.style.top = '145px';
    } else if (screenWidth >= 1200) {
        // Medium-large screens: 25% of viewport width
        panelWidth = Math.min(Math.max(screenWidth * 0.27, 280), 380);
        panel.style.right = '20px';
        panel.style.top = '145px';
    } else if (screenWidth >= 992) {
        // Medium screens: 30% of viewport width
        panelWidth = Math.min(Math.max(screenWidth * 0.32, 260), 340);
        panel.style.right = '15px';
        panel.style.top = '145px';
    } else if (screenWidth >= 768) {
        // Small screens: Fixed width
        panelWidth = 280;
        panel.style.right = '10px';
        panel.style.top = '145px';
    } else {
        // Mobile: Smaller fixed width
        panelWidth = 250;
        panel.style.right = '10px';
        panel.style.top = '145px';
    }

    panel.style.width = panelWidth + 'px';

    // Store panel width for main content adjustment
    window.attendancePanelWidth = panelWidth + (screenWidth >= 768 ? 40 : 20); // Add margins
}

// Add new function to adjust main content width
function adjustMainContentWidth() {
    const container = document.getElementById('kt_app_content_container');
    const mainCard = container?.querySelector('.card-body');

    if (!container || !mainCard) return;

    const screenWidth = window.innerWidth;
    const panelWidth = window.attendancePanelWidth || 0;

    if (screenWidth >= 768) {
        // On larger screens, reduce main content width to make space for panel
        const availableWidth = screenWidth - panelWidth - 40; // 40px for margins
        container.style.maxWidth = Math.max(availableWidth, 400) + 'px';
        container.style.marginRight = '0';
    } else {
        // On mobile, let main content use full width (panel will overlay)
        container.style.maxWidth = '100%';
        container.style.marginRight = '0';
    }
}

// Update   injectStyles function to include responsive styles
function injectStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
    .student-card {
        width: 100%;
        max-width: 380px;
        background: white;
        border-radius: 16px;
        padding: 20px 20px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        text-align: center;
        transition: all 0.3s ease;
    }
    .student-card h2 {
        font-size: 22px;
        margin-bottom: 10px;
        color: #333;
    }
    .student-card p {
        font-size: 16px;
        color: #555;
    }
    .instruction {
        margin-top: 15px;
        color: #999;
        font-size: 14px;
    }
    #studentCardDiv {
        transition: opacity 0.3s ease;
        opacity: 1;
    }
    #studentCardDiv:not(.show-card) {
        opacity: 0;
    }
    .current-row {
        background-color: #fffbcc !important;
    }
    .present-row {
        background-color: #e0f7e9 !important;
    }
    .absent-row {
        background-color: #fdecea !important;
    }

    .attendance-btn {
        width: 50px !important;
        height: 50px !important;
        border-radius: 50% !important;
        border: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: background-color 0.2s ease !important;
        padding: 0 !important;
    }

    .attendance-btn.bg-light-success {
        background-color: #e6f4ea !important;
    }
    .attendance-btn.bg-light-success:hover {
        background-color: #d1ebdd !important;
    }

    .attendance-btn.bg-light-danger {
        background-color: #fce8e6 !important;
    }
    .attendance-btn.bg-light-danger:hover {
        background-color: #f8d7da !important;
    }

    /* Remove most media queries since we handle it with JavaScript */
    @media (max-width: 768px) {
        .student-card {
            padding: 20px 10px !important;
        }
        .attendance-btn {
            width: 45px !important;
            height: 45px !important;
        }
        .student-card h2 {
            font-size: 18px !important;
        }
        .student-card p {
            font-size: 14px !important;
        }
    }

    @media (max-width: 480px) {
        .student-card h2 {
            font-size: 16px !important;
        }
        .student-card p {
            font-size: 13px !important;
        }
        .attendance-btn {
            width: 40px !important;
            height: 40px !important;
        }
    }
    `;
    document.head.appendChild(style);
}


function extractStudents() {
    const table = document.querySelector('.card-body table');
    const rows = table.querySelectorAll('tbody tr');
    studentsList = [];

    rows.forEach(row => {
        const columns = row.querySelectorAll('td');
        if (columns.length >= 3) {
            const id = columns[0].innerText.trim();
            const name = columns[1].innerText.trim();
            studentsList.push({ id, name, row });

            // Attach event listeners to the radio buttons
            const radios = row.querySelectorAll('input[type="radio"]');
            if (radios.length >= 2) {
                radios[0].addEventListener('change', () => onRadioChange(id, 'Present'));
                radios[1].addEventListener('change', () => onRadioChange(id, 'Absent'));
            }
        }
    });
}

function onRadioChange(studentId, newStatus) {
    const student = studentsList.find(s => s.id === studentId);
    if (student) {
        student.status = newStatus;
        highlightCurrentRow();

        // If report is shown, re-render it
        const cardDiv = document.getElementById("studentCardDiv");
        if (cardDiv && cardDiv.innerHTML.includes("Attendance Report")) {
            renderAttendanceComplete();
        }
    }
}


function renderCard() {
    const cardDiv = document.getElementById("studentCardDiv");

    if (window.innerWidth >= 1700) {
        const card = document.querySelector('.student-card');
        if (card) {
            card.style.maxWidth = '360px'; // or even 400px
            card.style.width = '100%';
        }
    }


    if (currentIndex >= studentsList.length) {
        renderAttendanceComplete();
        return;
    }

    const student = studentsList[currentIndex];

    cardDiv.classList.remove("show-card");

    if (keyboardHintDiv) {
        keyboardHintDiv.style.display = "block";
    }


    setTimeout(() => {

        cardDiv.innerHTML = `
            <div class="student-card d-flex flex-column align-items-center">
                <h2>${student.name}</h2>
                <p>ID: ${student.id}</p>

                <div class="mt-4 d-flex gap-4">
                    <button id="absentBtn" class="attendance-btn bg-light-danger" title="Mark Absent">
                        <i class="bi bi-x-lg text-danger fs-5"></i>
                        </button>
                        <button id="presentBtn" class="attendance-btn bg-light-success" title="Mark Present">
                        <i class="bi bi-check-lg text-success fs-5"></i>
                    </button>

                </div>


            </div>
        `;

        document.getElementById("presentBtn").onclick = () => {
            markAttendance("Present");
            currentIndex++;
            renderCard();
        };
        document.getElementById("absentBtn").onclick = () => {
            markAttendance("Absent");
            currentIndex++;
            renderCard();
        };

        cardDiv.classList.add("show-card");
    }, 200);

    highlightCurrentRow();
}


function markAttendance(status) {
    const student = studentsList[currentIndex];
    const radios = student.row.querySelectorAll('input[type="radio"]');

    if (radios.length >= 2) {
        const targetRadio = status === 'Present' ? radios[0] : radios[1];
        targetRadio.checked = true;

        // Dispatch a proper change event
        const event = new Event('change', { bubbles: true });
        targetRadio.dispatchEvent(event);
    }

    student.status = status;
}


function handleKeyDown(e) {
    if (currentIndex >= studentsList.length) return;

    if (e.key === 'ArrowRight') {
        markAttendance('Present');
        currentIndex++;
        renderCard();
    }
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        markAttendance('Absent');
        currentIndex++;
        renderCard();
    }
}


function highlightCurrentRow() {
    studentsList.forEach((student, index) => {
        student.row.classList.remove("current-row", "present-row", "absent-row");
        if (index < currentIndex) {
            if (student.status === 'Present') student.row.classList.add("present-row");
            else if (student.status === 'Absent') student.row.classList.add("absent-row");
        } else if (index === currentIndex) {
            student.row.classList.add("current-row");
        }
    });

    if (studentsList[currentIndex]) {
        const row = studentsList[currentIndex].row;
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}


function renderAttendanceComplete() {
    const cardDiv = document.getElementById("studentCardDiv");
    const absentStudents = studentsList.filter(s => s.status === 'Absent');
    if (keyboardHintDiv) {
        keyboardHintDiv.style.display = "none";
    }


    // Get class date
    let classDate = "Attendance";
    try {
        const allFields = document.querySelectorAll('formly-field');
        for (const field of allFields) {
            if (field.innerText.includes('Class')) {
                const span = field.querySelector('.mat-mdc-select-value-text span');
                if (span && span.innerText.includes('-')) {
                    const match = span.innerText.match(/\d{2}-\d{2}-\d{4}/);
                    if (match) {
                        classDate = match[0];
                    }
                    break;
                }
            }
        }
    } catch (e) {
        console.warn("Could not extract class date:", e);
    }

    let html = `
  <div class="d-flex flex-column gap-2 mb-3">
    <div style="
      background-color: #e7f3fe;
      color: #0c5460;
      border: 1px solid #b8daff;
      border-radius: 16px;
      padding: 6px 10px;
      font-size: 11.5px;
    ">
      <i class="bi bi-info-circle-fill me-1" style="color: #0c5460;"></i>
      Don't forget to save attendance on Connect.
    </div>
    <div style="
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
      border-radius: 16px;
      padding: 6px 10px;
      font-size: 11.5px;
    ">
      <i class="bi bi-exclamation-triangle-fill me-1" style="color: #856404;"></i>
      Copy button only backs up — it doesn't save attendance.
    </div>
  </div>

  <div style="
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.05);
    width: auto;
    max-height: 70vh;
    overflow-y: auto;
    display: inline-block;
  ">
    <h2 style="font-size: 17px; margin-bottom: 4px;">
        📋 Attendance Report - <span style="color: #007bff;">${classDate}</span>
    </h2>
    <h3 
        style="font-size: 15px; margin-bottom: 10px; color: #444;" 
        title="Students not marked as present"
    >
        👥 Absent Students
    </h3>
`;


    if (absentStudents.length > 0) {
        html += `
        <div style="overflow-x: auto;">
            <table style="
                border-collapse: collapse;
                font-size: 13px;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #f5c2c7;
                box-shadow: 0 1px 5px rgba(0,0,0,0.03);
                width: auto;
            ">
                <thead style="background-color: #f8d7da; color: #000;">
                    <tr>
                        <th style="padding: 6px 12px; text-align: left;">ID</th>
                        <th style="padding: 6px 12px; text-align: left;">Name</th>
                    </tr>
                </thead>
                <tbody>
        `;
        absentStudents.forEach(s => {
            html += `
                <tr style="background-color: #fff0f0;">
                    <td style="padding: 6px 12px;">${s.id}</td>
                    <td style="padding: 6px 12px;">${s.name}</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        </div>
        `;
    } else {
        html += `
            <div style="color: #28a745; font-weight: 500; font-size: 15px;">
                ✅ All students are present!
            </div>
        `;
    }

    html += `</div>`; // close card

    cardDiv.innerHTML = html;
    highlightCurrentRow();
    hookSaveButtonToCopy();
}

function fullResetAttendancePanel() {
    studentsList = [];
    currentIndex = 0;

    const cardDiv = document.getElementById("studentCardDiv");
    if (cardDiv) cardDiv.innerHTML = "";

    const buttonContainer = document.querySelector(".d-flex.mt-4, .d-flex.flex-wrap.mt-4");
    if (buttonContainer) buttonContainer.classList.add("d-none");

    // Remove all potential start buttons
    const oldWrappers = document.querySelectorAll("#startBtnWrapper");
    oldWrappers.forEach(w => w.remove());

    const cardBody = document.querySelector('#myCustomGreenDiv .card-body');
    if (!cardBody) return;

    const startBtnWrapper = document.createElement("div");
    startBtnWrapper.id = "startBtnWrapper";
    startBtnWrapper.style.display = "flex";
    startBtnWrapper.style.justifyContent = "center";
    startBtnWrapper.style.alignItems = "center";
    startBtnWrapper.style.height = "100%";

    if (keyboardHintDiv) {
        keyboardHintDiv.style.display = "none";
    }

    const startBtn = document.createElement("button");
    startBtn.className = "btn btn-success";
    startBtn.innerHTML = `<i class="bi bi-play-circle me-1"></i> Start Attendance`;
    startBtn.onclick = () => {


        const table = document.querySelector('.card-body table');
        if (!table) {
            alert("Student table not found. Make sure the list is visible.");
            return;
        }
        startBtn.disabled = true;
        startBtn.innerText = "Starting...";
        extractStudents();
        currentIndex = 0;
        keyboardHintDiv.style.display = "block";

        renderCard();
        window.addEventListener('keydown', handleKeyDown);

        startBtnWrapper.remove();
        document.querySelector(".d-flex.mt-4, .d-flex.flex-wrap.mt-4")?.classList.remove("d-none");
    };



    startBtnWrapper.appendChild(startBtn);
    cardBody.append(startBtnWrapper);


}



function monitorExactClassSelectChange() {
    const labelSpan = document.querySelector('#mat-select-value-13 > span > span');
    const selectElement = document.querySelector('#mat-select-12');

    if (!labelSpan || !selectElement) {
        setTimeout(monitorExactClassSelectChange, 1000);
        return;
    }

    let previousValue = labelSpan.innerText.trim();
    let wasDisabled = selectElement.getAttribute("aria-disabled") === "true";

    setInterval(() => {
        const currentLabel = document.querySelector('#mat-select-value-13 > span > span');
        const currentSelect = document.querySelector('#mat-select-12');

        const currentValue = currentLabel?.innerText?.trim() || "";
        const isDisabled = currentSelect?.getAttribute("aria-disabled") === "true";

        const valueChanged = currentValue !== previousValue;
        const disabledChanged = isDisabled !== wasDisabled;

        if ((valueChanged || disabledChanged) && document.getElementById("myCustomGreenDiv")) {
            previousValue = currentValue;
            wasDisabled = isDisabled;
            fullResetAttendancePanel();
        }
    }, 1000);
}


function resetPanelLayout() {
    const container = document.getElementById('kt_app_content_container');
    const cardBody = container?.querySelector('.card-body');

    if (container) {
        container.style.display = '';
        container.style.flexDirection = '';
        container.style.gap = '';
        container.style.maxWidth = '';
        container.style.width = '';
        container.style.padding = '';
        container.style.margin = '';
    }

    if (cardBody) {
        cardBody.style.boxSizing = '';
    }
}


// 3. Route monitoring logic
let currentPath = '';
let panelInserted = false;

function monitorPageChanges() {
    setInterval(() => {
        const newPath = window.location.pathname;
        if (newPath !== currentPath) {
            currentPath = newPath;
            handleRouteChange(newPath);
        }
    }, 500);
}

function handleRouteChange(path) {
    const panel = document.getElementById('myCustomGreenDiv');
    if (path === '/app/exam-controller/attendance/entry') {
        if (!panelInserted) {
            waitForContainerAndInsertPanel();
            panelInserted = true;
        }
    } else {
        if (panel) {
            panel.remove();
            resetPanelLayout(); // ✅ fix the scrambled layout
            panelInserted = false;
            studentsList = [];
            currentIndex = 0;
        }
    }
}

function waitForContainerAndInsertPanel() {
    const container = document.getElementById('kt_app_content_container');
    if (!container) {
        setTimeout(waitForContainerAndInsertPanel, 300);
        return;
    }
    insertPanel(container);
}

// ✅ 4. Start monitoring after everything is defined
monitorPageChanges();
