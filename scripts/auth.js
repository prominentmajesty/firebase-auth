//add admin cloud functions
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({email : adminEmail}).then(result => {
        console.log(result);
    });
});

//Listen For Auth status Change  
auth.onAuthStateChanged(user => {
    if(user){
        user.getIdTokenResult().then(idTokenResult => {
          user.admin = idTokenResult.claims.admin;
          setupUI(user);
        });
        db.collection('guides').onSnapshot(snapshot => {
            setupGuides(snapshot.docs);
        }, err => {
            console.log(err);
        });
    }else{
        setupUI();
        setupGuides([]);
    }
});

//create new Guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    db.collection('guides').add({
        title : createForm['title'].value,
        content : createForm['content'].value
    }).then(()=>{
        //close the model and reset the form
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    }).catch((err) => {
        console.log(err.message); 
    }); 
});

//Signup
const signup_form = document.querySelector('#signup-form');
signup_form.addEventListener('submit', (e) => { 
    e.preventDefault();

    //Get the user info
    const email = signup_form['signup-email'].value;
    const password = signup_form['signup-password'].value

    //sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(user => {
        
        return db.collection('users').doc(user.user.uid).set({
            bio : signup_form['signup-bio'].value
        });
    }).then(() =>{
        const modal_signup = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal_signup).close();
        signup_form.reset();
        signup_form.querySelector('.error').innerHTML = '';
    }).catch(err => {
        signup_form.querySelector('.error').innerHTML = err.message;
    });
});

const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

const login_form = document.querySelector('#login-form');
login_form.addEventListener('submit', (e)=>{
    e.preventDefault();

    const email = login_form['login-email'].value;
    const password = login_form['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then((user) => {
        const modal_login = document.querySelector('#modal-login');
        M.Modal.getInstance(modal_login).close();
        login_form.reset();
        login_form.querySelector('.error').innerHTML = '';
    }).catch(err => {
        login_form.querySelector('.error').innerHTML = err.message;
    });
});