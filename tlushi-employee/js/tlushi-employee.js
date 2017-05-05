var employeeAPI = function() {
    var angle = 0;      // for rotate

//  VARIABLES 
    var minHour;   // שכר מינימום לשעה
    var minMonth; // שכר מינימום חודשי
    var travelDay;   // נסיעות ליום  
    var weekHours;    // שעות שבועיות


//	Create the initial appearance of the site
	var initModule = function() {
        var database = firebase.database();
        var leadsRef = database.ref('Settings');
        leadsRef.on('value', function(snapshot) { 
            snapshot.forEach(function(childSnapshot) {             
            var childData = childSnapshot.val();
            minHour= parseFloat(childData.minHour);
            minMonth= parseFloat(childData.minMonth);
            travelDay= parseFloat(childData.travelDay);
            weekHours= parseFloat(childData.weekHours);
            });
        });
		$("#butCalc").click(calc);
        $("#fileInput").click(openPic);
        $("#fileProgress").click(openProgress);
        $("#fileProgressUpload").click(uploadInProgress);
        $('#zoom-in').click(zoomIn); 
        $('#zoom-out').click(zoomOut);
        $('#reset-zoom').click(zoomReset);
        $('#rotate').click(rotate);
        $('#buttonLogInAdmin').click(buttonPopUp);
        $('#forgetPassword').click(forgetPassword);
        $('#signUpAdmin').click(signUpAdmin);
    };
    // הרשרמת מנהל נוסף
    var signUpAdmin= function(){
         var email =$("#emailAdmin").val();
        var password = $("#passwordAdmin").val();
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
          var newEmail= window.prompt("הכנס אימייל ליצירת משתמש");
          var newPassword= window.prompt("הכנס סיסמא (אורך הסיסמא לפחות 6 תווים)");
          var newPasswordRe= window.prompt("חזור על הסיסמא");
          if(newPassword != newPasswordRe || newPassword.length < 6){
              alert("סיסמא לא תקינה");
              return false;
          }
          else{
            firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword).then(function(){
                alert("נוצר משתמש חדש");
            }).catch(function(error){
             // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
            // ...
            });
          }
          }).catch(function(error) {
            // Handle Errors here.
            alert("להרשמת מנהל חדש יש להכניס אימייל וסיסמא של מנהל נוכחי")
            // ...
        });
        return false;
    }

    // מנהל שכח סיסמא
    var forgetPassword= function(){
        var auth = firebase.auth();
        var email =$("#emailAdmin").val();
        auth.sendPasswordResetEmail(email).then(function() {
            alert("נשלח אימייל לשחזור סיסמא")
        // Email sent.
    }, function(error) {
        // An error happened.
         var errorCode = error.code;
         var errorMessage = error.message;
        // alert(errorCode);
         alert(errorMessage);
        });
    }

    // עידכון המשתנים הקבועים במסד נתונים
    var updateAdminValues= function(){
        var database = firebase.database();
        var leadsRef = database.ref('Settings');
        leadsRef.on('value', function(snapshot) { 
            snapshot.forEach(function(childSnapshot) {             
            var childData = childSnapshot.val();
            var key=childSnapshot.key;
            database.ref("Settings/"+key+"/minHour").set(parseFloat($("#txtSettingsMinHour").val()));
            database.ref("Settings/"+key+"/minMonth").set(parseFloat($("#txtSettingsMinMounth").val()));
            database.ref("Settings/"+key+"/travelDay").set(parseFloat($("#txtTravelDay").val()));
            database.ref("Settings/"+key+"/weekHours").set(parseFloat($("#txtSettingsWeekHours").val()));      
            });
        });
        alert("השינויים בוצעו בהצלחה");
        location.reload();        
    }
    // הצגת הדף למנהל עם עידכון הפרטים האפשריים
    var adminSettings= function(){
        var content= "<label>שכר מינימום לשעה:</label>"+
                     "<input type='number' class='textPopUp' id='txtSettingsMinHour' step='0.01' required>"+
                     "<label>שכר מינימום חודשי:</label>"+
                     "<input type='number' class='textPopUp' id='txtSettingsMinMounth' step='0.01' required>"+
                     "<label>מספר שעות עבודה בחודש:</label>"+
                     "<input type='number' class='textPopUp' id='txtSettingsWeekHours' step='0.01' required>"+
                     "<label>דמי נסיעות:</label>"+
                     "<input type='number' class='textPopUp' id='txtTravelDay' step='0.01' required>"+
                     "<button id= 'buttonUpdateAdmin' class='buttonPopUp' type='button'>עדכן נתונים</button>";
        $("#footerPopUp").html("");
        $("#containarPopUp").html(content);
        $("#txtSettingsMinHour").val(minHour);
        $("#txtSettingsMinMounth").val(minMonth);
        $("#txtSettingsWeekHours").val(weekHours);
        $("#txtTravelDay").val(travelDay);
        $('#buttonUpdateAdmin').click(updateAdminValues);
    }
    // פתיחת מסך התחברות למנהל 
    var buttonPopUp = function(){
        var email =$("#emailAdmin").val();
        var password = $("#passwordAdmin").val();
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
          adminSettings();
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode);
            alert(errorMessage);
            // ...
        });
        return false;
    }
    var openPic = function(){
        var flag= false;
        var database = firebase.database();
        var leadsRef = database.ref('user');
        leadsRef.on('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                if(flag == false)
                {                     
                    var childData = childSnapshot.val();
                    if(childData.status == "false")
                    {
                        flag= true;
                        var preview = document.getElementById('pic'); //selects the query named img
                        preview.src = childData.paycheck;
                        var key=childSnapshot.key;
                        database.ref("user/"+key+"/status").set("true");
                    }
                }
             });
             if(flag == false)
                alert("אין טופס לבדיקה");   
        });
};
    var openProgress = function(){
        var list = $("#progress");
        var database = firebase.database();
        var leadsRef = database.ref('user');
        leadsRef.on('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {                     
                var childData = childSnapshot.val();
                if(childData.status == "true")
                {
                    list.append(new Option(childData.email, childData.email));
                }
             });
        });
    };
    var uploadInProgress = function(){
        var database = firebase.database();
        var leadsRef = database.ref('user');
        leadsRef.on('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {                     
                var childData = childSnapshot.val();
                if($("#progress option:selected").text() == childData.email)
                {
                     var preview = document.getElementById('pic'); //selects the query named img
                    preview.src = childData.paycheck;
                }
             });
        });
    };
    var calc = function() {
        var hourWage = parseFloat($("#txtPayForHour").val());    // שכר לשעה
        var regularWorkHours = parseFloat($("#txtRegularWorkHours").val()); // שעות עבודה רגילות
        var regularPayment = parseFloat($("#txtRegularPayment").val()); // תשלום על שעות עבודה רגילות
        var employeePension = parseFloat($("#txtWorkerPension").val()); // הפרשת עובד לפנסיה
        var employeePension = parseFloat($("#txtEmployerPension").val()); // הפרשת מעביד לפנסיה
        
        // פער משכר מינימום
        var minWageGap = 0;
        if(hourWage<minHour)
            minWageGap = (minHour-hourWage)*regularWorkHours;
        
        // פער משכר יסוד
        var basicWageGap = 0;
        if(hourWage<minHour)
            basicWageGap=minHour*regularWorkHours-regularPayment;
        else
        {
            if(hourWage*regularWorkHours>regularPayment)
                 basicWageGap=hourWage*regularWorkHours-regularPayment;
        }

        // פער בהפרשת פנסיה של העובד
        var employeePensionGap = 0;
        if(hourWage<minHour)
            employeePensionGap = minHour*regularWorkHours*0.06-employeePension;
        else
            employeePensionGap = hourWage*regularWorkHours*0.06-employeePension;

        
        // פער בהפרשת פנסיה של המעביד
        var employerPensionGap = 0;
         if(hourWage<minHour)
            employerPensionGap = minHour*regularWorkHours*0.125-employerPension;
        else
            employerPensionGap = hourWage*regularWorkHours*0.125-employerPension;

        console.log("minWageGap = "+minWageGap);
        console.log("basicWageGap = "+basicWageGap);
        console.log("employeePensionGap = "+employeePensionGap);
        console.log("employerPensionGap = "+employerPensionGap);
        //fillOutput();
    };

    var zoomIn = function(){
        $('#pic').width($('#pic').width()*1.2)
        $('#pic').height($('#pic').height()*1.2)
    }

    var zoomOut = function(){
        $('#pic').width($('#pic').width()/1.2)
        $('#pic').height($('#pic').height()/1.2)
    }

    var zoomReset = function(){
        $('#pic').width("100%");
        $('#pic').height("100%");
    }

    var rotate = function(){
        img = document.getElementById('container');
        angle = (angle + 90) % 360;
        img.className = "rotate" + angle;
    }

     var previewFile = function(){
        var preview = document.getElementById('pic'); //selects the query named img
        var input = document.getElementById('fileInput');
        var file = input.files[0];
        var reader  = new FileReader();
        reader.onloadend = function () {
            preview.src = reader.result;
        }
       
        if (file) {
            reader.readAsDataURL(file); //reads the data as a URL
        } else {
            preview.src = "";
        }
   }

    var fillOutput = function(){
        var text = 
            /*"<h1>תלוש השכר שלך במילים פשוטות </h1>"+
            "</p>"+
            "<h3>מה שמגיע לך</h3>"+
            "</p>"+
            "<label>תשלום על שעות נוספות</label>"+
            "<div id='extraHoures'></div>"+
            "<label>ימי חופשה</label>"+
            "<div id='vication'></div>"+
            "<label>דמי הבראה</label>"+
            "<div id='health'></div>" ;
        $("body").html(text);*/
           
            "<div class='output'>"+
                "<img height='100' src='labelTlushi.jpg' width='200'>"+
                "<h1>תלוש השכר שלך במילים פשוטות :</h1>"+
                "<h2><p><u>מה שמגיע לך</u>:</p></h2>"+
                "<p></p>"+
                "<table>"+
                    "<tr>"+
                        "<th>"+
                            "<img height='50' src='clock.png' width='50'>"+
                            "<p>תשלום על שעות נוספות :</p>"+
                            "<div id='extraHoures'></div>"+
                            "<p><u></u></p>"+
                        "</th>"+
                        "<th>"+
                            "<img height='50' src='plane.png' width='50'>"+
                            "<p>ימי חופשה :</p>"+
                            "<div id='vication'></div>"+
                            "<p></p>"+
                        "</th>"+
                        "<th>"+
                            "<img height='50' src='heart.png' width='50'>"+
                            "<p>ימי הבראה :</p>"+
                            "<div id='health'></div>" +
                            "<p><u></u></p>"+
                        "</th>"+
                    "</tr>"+
                "<table>"+
                "<p>סיכום :</p>"+
                "<div id='summery'></div>" +
                "<p><u></u></p>"+
                "<p></p>"+
                "<p></p>"+
                "<h2><p><u>מה קיבלת</u>:</p></h2>"+
                "<p><u></u></p>"+
                "<p><u></u></p>"+
                "<h2><p><u>כדאי לבדוק:</u></p></h2>"+
                "<p></p>"+
                "<p></p>"+
                "<button id = 'save' class='form-style-9'>שמור</button>"+
            "</div>";
        $("body").html(text);
        $("#save").click(function(){document.getElementById('save').style.visibility='hidden'; 
                                    window.print();
                                    document.getElementById('save').style.visibility='visible'});

    }

    return {
        initModule : initModule,
    };
}();

$(document).ready(employeeAPI.initModule);