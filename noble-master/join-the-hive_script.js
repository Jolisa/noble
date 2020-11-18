
url = "https://0d7cf27c774c.ngrok.io"

function join_membership(a_name, a_password, a_email, a_number, membershipRadio, a_listserve, a_text_list) {
	/*Submits join-the-hive form to database after checking that all fields are valid, displays an error modal
	and clears form otherwise*/

	name =  document.getElementById(a_name).value;
	password =  document.getElementById(a_password).value;
	email =  document.getElementById(a_email).value;
	number =  document.getElementById(a_number).value;
	listserve =  document.getElementById(a_listserve).checked;
	text_list =  document.getElementById(a_text_list).checked;
	console.log(name)

	var membership;
	var radios = document.getElementsByName('membershipRadio');
	for (var i = 0, length = radios.length; i < length; i++) {
	  if (radios[i].checked) {
	    membership = radios[i].value;
	    break;
	  }
	}
	console.log(listserve)
	console.log(text_list)



	var payload = {"name": name, "password": password, "email": email, 
      "membershipTier": membership,"emailListserve": textListserve, "text_list": text_list}
    console.log(JSON.stringify(payload))


    const mongoInfo = {firstName: firstName, lastName: lastName, 
    membershipTier: req.body.tier,
    email: req.body.email, phone: req.body.phone,
    emailListserve: req.body.emailList , req.body.textList

  }

    
    var test_payload = {"firstName": name, "lastName": name, 
      "password": password, "netId": "jmb26", "sponsored": "yes", 
      "email": email, "atitle": "ish", "password": password}
    /*this.router.navigate(['/index']);*/
    //window.location.href = "index.html";

    /*fetch('http://localhost:3000/register', {method:'POST', body: JSON.stringify(test_payload)})
    	.then(results => results.json())
    	.then(console.log);*/
    fetch(url + '/register', {
  		method: 'post',
	    headers: {
		    'Accept': 'application/json, text/plain, */*',
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify(test_payload)
		})

    /*var form = document.getElementById("myFormhere");
		form.reset();*/


}

function charge_card(name, card, email) {
	/*Submits join-the-hive form to database after checking that all fields are valid, displays an error modal
	and clears form otherwise*/

	name =  document.getElementById(stripe_name).value;
	card =  document.getElementById(card-element).value;
	email =  document.getElementById(stripe_email).value;
	




    
    var test_payload = {"firstName": name, "lastName": "Girlie", 
      "researchGroup": "HERC", "netId": "jmb26", "sponsored": "yes", 
      "email": email, "atitle": "ish", "password": password}
    /*this.router.navigate(['/index']);*/
    //window.location.href = "index.html";

    /*fetch('http://localhost:3000/register', {method:'POST', body: JSON.stringify(test_payload)})
    	.then(results => results.json())
    	.then(console.log);*/
    fetch(url + '/payment', {
  		method: 'post',
	    headers: {
		    'Accept': 'application/json, text/plain, */*',
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify(test_payload)
		})

}

function billing_choice(){
	/* Allow tier 1 members to make decision on adding card info*/
	document.getElementById("billing_display").style.display = 'block'; 

}

function display_radio_memberships(){
	/* Display membership information for selected tier upon radio selection */
	console.log("We have selected a new membership tier.")

	var membership;
	var radios = document.getElementsByName('membershipRadio');
	for (var i = 0, length = radios.length; i < length; i++) {
	  membership = (radios[i].value).concat("-card");
	  if (radios[i].checked) {
	  	document.getElementById(membership).style.display = 'block';   
	    console.log(membership)
	    ///clear out visual of other tiers
	    //make current tier visible    
	  }
	  else {
	  	document.getElementById(membership).style.display = 'none';

	  }


	}

}