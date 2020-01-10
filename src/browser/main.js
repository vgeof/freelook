(function () {

	window.addEventListener('onreadystatechange',() => {

        if(isLoginPage())
        {
		    console.log("coucou");
        }
        if(document.readyState === 'complete') {
        findEmailInput().value = 'toto'
        }

        
    function isLoginPage()
        {
        return document.URL.includes("login");
        }
        function findEmailInput()
        {
            console.log(document.querySelector('body'));
            return document.querySelector('input[type=email]')
        }

	});}())

