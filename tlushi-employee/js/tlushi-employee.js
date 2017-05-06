var employeeAPI = function() {
    var angle = 0;      // for rotate

//  VARIABLES 
    var minHour;   // שכר מינימום לשעה
    var minMonth; // שכר מינימום חודשי
    var travelDay;   // נסיעות ליום  
    var weekHours;    // שעות שבועיות
    var daysHolidayArray;      // ימי חופשה לפי ותק
    var daysRecoveryArray;  // ימי הבראה לפי ותק


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
            daysHolidayArray= childData.daysOff;
            daysRecoveryArray= childData.daysRecovery;
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
        var holidayArray = ($("#txtDaysHolidayArray").val().split(",")).map(Number);
        var recoveryArray = ($("#txtDaysRecoveryArray").val().split(",")).map(Number);
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
            database.ref("Settings/"+key+"/daysOff").set(holidayArray);                  
            database.ref("Settings/"+key+"/daysRecovery").set(recoveryArray);                  
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
                     "<label>ימי חופשה לפי ותק (מערך):</label>"+
                     "<input class='textPopUp' id='txtDaysHolidayArray' required>"+
                     "<label>ימי הבראה לפי ותק (מערך):</label>"+
                     "<input class='textPopUp' id='txtDaysRecoveryArray' required>"+
                     "<button id= 'buttonUpdateAdmin' class='buttonPopUp' type='button'>עדכן נתונים</button>";
        $("#footerPopUp").html("");
        $("#containarPopUp").html(content);
        $("#txtSettingsMinHour").val(minHour);
        $("#txtSettingsMinMounth").val(minMonth);
        $("#txtSettingsWeekHours").val(weekHours);
        $("#txtTravelDay").val(travelDay);
        $("#txtDaysHolidayArray").val(daysHolidayArray);
        $("#txtDaysRecoveryArray").val(daysRecoveryArray);
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
        list.empty();
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
        return false;
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
        var employerPension = parseFloat($("#txtEmployerPension").val()); // הפרשת מעביד לפנסיה
        var travelPayment = parseFloat($("#txtTravelPayment").val());   //נסיעות / חופי חודשי
        var daysOfWork = parseFloat($("#txtDaysOfWork").val());     // ימי עבודה
        var extraHours125Pays= parseFloat($("#txtEx125Payment").val()); // סה"כ תשלום על שעות נוספות 125
        var extraHours150Pays= parseFloat($("#txtEx150Payment").val()); // סה"כ תשלום על שעות נוספות 150
        var accumulatedDaysOff= parseFloat($("#txtAccumulatedDaysOff").val()); // מספר ימי החופשה שנצברו
        var seniorYears= parseInt($("#txtSeniorYears").val());                  // ותק בשנים
        var convalescencePay= parseFloat($("#txtConvalescencePay").val());      // דמי הבראה
        var premiumWage= parseFloat($("#txtPremiumWage").val());                // פרמיה
  
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

        // סה"כ הפסד בש"ח על בסיס דמי נסיעות
        var travelFeesLoss = 0;
        if(travelPayment<daysOfWork*travelDay)
            travelFeesLoss = daysOfWork*travelDay-travelPayment;

        // סה"כ הפסד על שעות נוספות
        var extraHouresLoss= 0;
        if(regularWorkHours == 187)
            extraHouresLoss= (extraHours125Pays+extraHours150Pays)-(hourWage*1.25);
        if(regularWorkHours == 188)
             extraHouresLoss= (extraHours125Pays+extraHours150Pays)-(hourWage*1.25*2);
        if(regularWorkHours > 188)
             extraHouresLoss= (extraHours125Pays+extraHours150Pays)-(hourWage*1.25*2)+((regularWorkHours-188)*1.5*hourWage);

        // ימי חופשה נוספים שמגיעים לך
        var daysOffDeserve= 0;
        var daysOffSeniority= 0;
        if(seniorYears > 14)
            daysOffSeniority= 20;
        else
            daysOffSeniority= daysHolidayArray[seniorYears-1];
        if(accumulatedDaysOff < daysOffSeniority){
            daysOffDeserve= daysOffSeniority- accumulatedDaysOff;
        }

        // הפסד כסף על חישוב הבראה לא נכון
        var daysRecoveryLoss= 0;
        var daysRecoverySeniority= 0;
        if(seniorYears > 20)
            daysRecoverySeniority= 10;
        else
            daysRecoverySeniority= daysRecoveryArray[seniorYears-1];
        if(regularWorkHours > 186)
            daysRecoveryLoss= daysRecoverySeniority*378-convalescencePay;
        else
            daysRecoveryLoss= (regularWorkHours/186)*daysRecoverySeniority*378;

        // פער בהפרשת פנסיה של העובד עם פרמיה
        var employeePremiumGap= 0;
        if(!(isNaN(premiumWage)))
        {
            if(hourWage < minHour)
                employeePremiumGap= (minHour*regularWorkHours+premiumWage)*0.06-employeePension;
            else
                 employeePremiumGap= (hourWage*regularWorkHours+premiumWage)*0.06-employeePension;
        }

        // פער בהפרשה פנסיה של המעביד עם פרמיה
        var employerPremiumGap= 0;
        if(!(isNaN(premiumWage)))
        {
             if(hourWage < minHour)
                employerPremiumGap= (minHour*regularWorkHours+premiumWage)*0.125-employerPension;
             else
                 employerPremiumGap= (hourWage*regularWorkHours+premiumWage)*0.125-employerPension;
        }
        // הפסד על דמי חבר וניכויים- לא ברור

        console.log("minWageGap = "+minWageGap);
        console.log("basicWageGap = "+basicWageGap);
        console.log("employeePensionGap = "+employeePensionGap);
        console.log("employerPensionGap = "+employerPensionGap);
        console.log("travelFeesLoss = "+ travelFeesLoss);
        console.log("extraHouresLoss = "+ extraHouresLoss);
        console.log("daysOffDeserve = "+ daysOffDeserve);
        console.log("daysRecoveryLoss= "+ daysRecoveryLoss);
        console.log("employeePremiumGap= "+employeePremiumGap);
        console.log("employerPremiumGap= "+employerPremiumGap);
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