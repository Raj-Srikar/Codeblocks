const nav = document.createElement('nav'),
mnav = document.querySelector('for-mobiles');

nav.innerHTML = `<a ${window.location.pathname!=='/' ? `href="/"` : ''}>
            <img src="${window.location.pathname.match('codeblock') ? '../' : ''}images/cb-thin-semisymmetrical-curved-monochrome.svg" id="cb-logo">
            <span id="title">
                <h1 id="cb-title">
                    <span id="title-code">Code</span><span id="title-blocks">Blocks</span><span id="title-study">.study</span>
                </h1>
            </span>
        </a>
        <span>
            <span id="tagline">"An innovative approach to learning Python and C++ at the same time"</span>
        </span>
        <span>
            <a href="authenticate.html" style="display:none">Login / Signup</a>
        </span>`;

window.onload = e => {
    let b = document.querySelector('body');
    b.insertBefore(nav, b.children[0]);
    if (!window.location.pathname.match('/dashboard')) {
    /*
        If the webpage is not dashboard
    */
        cb_auth.onAuthStateChanged(user => {
            updateUser(user);
            if (window.location.pathname.match('codeblock')){
            /*
                If current webpage is /codeblock
            */
                start();
                if (!user) {            // If user logged out
                    document.querySelector('a[href="authenticate.html"]').href = '../authenticate.html';
                    let m = document.querySelector('.menu');
                    m.innerHTML = '';
                    m.style.border = 'none';
                }
                else {                  // If user logged in
                    let filename = decodeURIComponent(urlParams.get('filename')), iex = urlParams.has('isExample');
                    if (filename !== 'null') {
                        if(!iex) {
                            db.collection('users').doc(cb_auth.currentUser.uid).collection('custom-files').doc(filename).get().then(s => {
                                !s.exists && window.open('/codeblock', '_self')
                            });
                            docTitle.innerHTML = filename + ' | ' + docTitle.innerHTML;
                        }
                        else docTitle.innerHTML = 'Ex: ' + filename + ' | ' + docTitle.innerHTML;
                    }
                    updateOriginalJson()
                    createMenuBar();
                    fetchExamples().then((arr)=>{
                        exampleFiles = arr;
                    })
                    fetchCustomFiles().then((arr)=>{
                        userFiles = arr;
                    })
                }
            }
        });
    }
    else {
        let s = nav.querySelector('nav>span:nth-child(3)');
        s.innerHTML = '<a href="/codeblock/" id="blocking">Start Blocking!</a>'
    }
}

const nav_link = document.createElement('link');
nav_link.setAttribute('rel','stylesheet');
nav_link.setAttribute('type','text/css');
nav_link.setAttribute('href', (window.location.pathname.match('codeblock') ? '../' : '') + 'styles/nav.css');
document.querySelector('head').insertBefore(nav_link, document.querySelector('link'));


function updateUser(user) {
    const span3 = document.querySelector('nav>span:nth-child(3)'),
    mspan3 = document.querySelector('.for-mobiles>span:nth-child(3)');
    if (user) {
        userInfo(user, false).then(uinf => {
            span3.id = 'authed-user';
            span3.innerHTML = `<img src="${uinf[0] || './images/account_circle.svg'}">
                                <span id="dname">${uinf[1]}</span>
                                <div id="user-dropdown">
                                    <a href="${window.location.pathname.match('codeblock') ? '../' : ''}dashboard.html"><span>My Profile</span></a>
                                    <div style="border-top:1px solid;border-radius:0 0 10px 10px" onclick="cb_logout()">Log Out</div>
                                </div>`;
            mspan3 && (mspan3.innerHTML = span3.innerHTML);
        })
    }
    else {
        span3.id = '';
        span3.innerHTML = '<a href="authenticate.html">Login / Signup</a>';
        mspan3 && (mspan3.innerHTML = '<a href="authenticate.html" id="authenticate">Login / Signup</a>');
    }
}
