const API = "http://localhost:5000";

////// LOGIN + SIGNUP + TOKEN SAVE

// SIGN UP
async function signup() {
    let name = document.getElementById("name").value;
    let password = document.getElementById("password").value;

    let res = await fetch(API + "/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password })
    });

    alert("Account created!");
    window.location = "login.html";
}

// LOGIN
async function login() {
    let name = document.getElementById("name").value;
    let password = document.getElementById("password").value;

    let res = await fetch(API + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password })
    });

    let data = await res.json();

    if (!data.token) {
        alert("Wrong login details!");
        return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role === "admin") {
        window.location = "admin.html";
    } else {
        window.location = "dashboard.html";
    }
}

///// MENUE TOGHLE

function toggleMenu() {
    document.getElementById("dropdown").classList.toggle("hidden");
}



//SUBMIT PAYMENT

async function addPayment() {
    let amount = document.getElementById("amount").value;
    let note = document.getElementById("note").value;

    let res = await fetch(API + "/payment/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({ amount, note })
    });

    alert("Submitted! Waiting for admin approval.");
}

//// USER HISTORY

async function loadHistory() {
    let res = await fetch(API + "/payment/history", {
        headers: { "authorization": localStorage.getItem("token") }
    });

    let data = await res.json();

    let box = document.getElementById("history");
    box.innerHTML = "";

    data.forEach(p => {
        box.innerHTML += `
            <div class="card">
                <b>Amount:</b> ₦${p.amount}<br>
                <b>Note:</b> ${p.note || '---'}<br>
                <b>Status:</b> ${p.approved ? "Approved" : "Pending"}
            </div>`;
    });
}


///// ADMIN VIEW

async function loadAdmin() {
    let res = await fetch(API + "/payment/all", {
        headers: { "authorization": localStorage.getItem("token") }
    });

    let data = await res.json();

    let box = document.getElementById("admin-list");
    box.innerHTML = "";

    data.forEach(p => {
        if (!p.approved) {
            box.innerHTML += `
                <div class="card">
                    <b>User:</b> ${p.user.name}<br>
                    <b>Amount:</b> ₦${p.amount}<br>
                    <b>Note:</b> ${p.note || '---'}<br><br>

                    <button onclick="approve('${p._id}')">Approve</button>
                    <button onclick="rejectPay('${p._id}')">Reject</button>
                </div>`;
        }
    });
}

async function approve(id) {
    await fetch(API + "/payment/approve/" + id, {
        method: "PUT",
        headers: { "authorization": localStorage.getItem("token") }
    });
    loadAdmin();
}

async function rejectPay(id) {
    await fetch(API + "/payment/reject/" + id, {
        method: "DELETE",
        headers: { "authorization": localStorage.getItem("token") }
    });
    loadAdmin();
}


/// RESET RECORDS

async function resetRecords() {
    let ok = confirm("Are you sure you want to reset? All contributions will be deleted!");
    if (!ok) return;

    await fetch(API + "/payment/reset", {
        method: "DELETE",
        headers: { "authorization": localStorage.getItem("token") }
    });

    alert("All records cleared!");
    loadAdmin();
}


/////LOGOUT

function logout() {
    localStorage.clear();
    window.location = "index.html";
}