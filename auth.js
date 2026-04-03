// ================= SIGNUP =================
function signup() {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {

            const user = userCredential.user;

            // ✅ Save user data (IMPORTANT FIX)
            firebase.database().ref("users/" + user.uid).set({
                name: name,
                email: user.email
            });

            window.location.href = "dashboard.html";
        })
        .catch(err => alert(err.message));
}


// ================= LOGIN =================
function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = "dashboard.html";
        })
        .catch(err => alert(err.message));
}


// ================= LOGOUT (optional but useful) =================
function logout() {
    firebase.auth().signOut()
        .then(() => {
            window.location.href = "index.html";
        })
        .catch(err => alert(err.message));
}