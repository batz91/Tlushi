var employeeAPI = function() {
    var angle = 0;      // for rotate

//  VARIABLES 
    var minHour;   // שכר מינימום לשעה
    var minMonth; // שכר מינימום חודשי
    var travelDay;   // נסיעות ליום  
    var weekHours;    // שעות שבועיות
    var daysHolidayArray;      // ימי חופשה לפי ותק
    var daysRecoveryArray;  // ימי הבראה לפי ותק
    var currentEmail;       // מחזיק את האימייל של הלקוח עליו עובדים
    var inputFieldsObject;
    var currentSnapshot;
    var salaryOutPut;
    var extraHouresOutPut;
    var travelFeesOutPut;
    var employeePensionOutPut;
    var employerPensionOutPut;
    var daysRecoveryOutPut;
    var deductionsOutPut;
    var daysHolidayOutPut;
    var outPutSum=0;
//	Create the initial appearance of the site
	var initModule = function() {
        var database = firebase.database();
        var leadsRef = database.ref('Settings');
        leadsRef.once('value', function(snapshot) { 
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
        $('#zoom-in').click({msg: 'pic'},zoomIn); 
        $('#zoom-out').click({msg: 'pic'},zoomOut);
        $('#reset-zoom').click({msg: 'pic'},zoomReset);
        $('#rotate').click(rotate);
        $('#buttonLogInAdmin').click(buttonPopUp);
        $('#forgetPassword').click(forgetPassword);
        $('#signUpAdmin').click(signUpAdmin);
    };
    // הרשמת מנהל נוסף
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
        leadsRef.once('value', function(snapshot) { 
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
    // הצגת דוח מוכן למנהל
    var findEndForm= function(){
        var flag= false;
        if($("#txtFindForm").val() == undefined)
        {
            alert('הכנס אימייל לקוח');
            return;
        }
        var database = firebase.database();
        var leadsRef = database.ref('user');
        leadsRef.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {                     
                var childData = childSnapshot.val();
                if($("#txtFindForm").val() == childData.email && childData.status == "done")
                {
                    flag= true;
                    var preview = document.getElementById('loadFormAdmin'); //selects the query named img
                    preview.src = childData.outPut;
                }
             });
             if(!flag)
             {
                 alert('לא קיים טופס לאימייל זה');
                 return false;
             }
        });
    };
    // מחיקת משתמשים שנשמרו
    var deleteSaved = function(){
        var flag= true;
        let storageRef = firebase.storage().ref();
        var database = firebase.database();
        var leadsRef = database.ref('user');
        leadsRef.once('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {                     
                var childData = childSnapshot.val();
                    if(childData.status == "saved")
                    {
                        
                        var desertRef = storageRef.child('paycheck/'+childData.email+childData.fileName+'.png');
                        // Delete the file
                        desertRef.delete().then(function() {
                        // File deleted successfully
                        }).catch(function(error) {
                        // Uh-oh, an error occurred!
                        });
                       var desertRef = storageRef.child('output/'+childSnapshot.key+'.png');
                        // Delete the   
                        desertRef.delete().then(function() {
                            alert("output delete");
                        // File deleted successfully
                        }).catch(function(error) {
                            alart("output delete feild");
                        // Uh-oh, an error occurred!
                        });
                        leadsRef.child(childSnapshot.key).remove();
                    }
                });
                if(flag)
                {
                    flag= false;
                    alert("המשתמשים נמחקו");
                    //location.reload();
                }
        });
        return false;
        
    }
    // גיבוי טפסים שסוימו לקובץ אקסל
    var backUp = function(){
        var flag= false;
        var database = firebase.database();
        var leadsRef = database.ref('user');
        var table=
                        "<table>"+
                             "<tr>"+
                                "<th>אימייל לקוח</th>"+
                                "<th>שם ממלא הטופס</th>"+
                                "<th>תאריך</th>"+
                                "<th>ימי עבודה</th>"+
                                "<th>שכר לשעה</th>"+
                                "<th>ותק שנים</th>"+
                                "<th>שעות עבודה רגילות בתלוש</th>"+
                                "<th>סה''כ תשלום על שעות עבודה רגילות</th>"+
                                "<th>סה''כ תשלום על שעות עבודה נוספות 125</th>"+
                                "<th>סה''כ תשלום על שעות עבודה נוספות 150</th>"+
                                "<th>נסיעות חודשי חופשי</th>"+
                                "<th>הפרשת עובד לפנסיה</th>"+
                                "<th>הפרשת מעביד פנסיה</th>"+
                                "<th>מספר ימי חופשה שנצברו</th>"+
                                "<th>דמי הבראה</th>"+
                                "<th>פרמיה</th>"+
                                "<th>ניכויים סכום</th>"+
                                "<th>ניכויים מלל</th>"+
                                "<th>תלוש משכורת</th>"+
                                "<th>דוח סופי</th>"+
                            "</tr>";
        leadsRef.once('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {                     
                var childData = childSnapshot.val();
                    if(childData.status == "done")
                    {
                        flag=true;
                        table+= "<tr>"+
                                    "<th>"+childData.email+"</th>"+
                                    "<th>"+childData.inputFields.EmployeeName+"</th>"+
                                    "<th>"+childData.inputFields.Date+"</th>"+
                                    "<th>"+childData.inputFields.WorkDays+"</th>"+
                                    "<th>"+childData.inputFields.HourlyWage+"</th>"+
                                    "<th>"+childData.inputFields.Seniority+"</th>"+
                                    "<th>"+childData.inputFields.WorkHours+"</th>"+
                                    "<th>"+childData.inputFields.RegularHoursPay+"</th>"+
                                    "<th>"+childData.inputFields.Pay125+"</th>"+
                                    "<th>"+childData.inputFields.Pay150+"</th>"+
                                    "<th>"+childData.inputFields.Travel+"</th>"+
                                    "<th>"+childData.inputFields.WorkerPension+"</th>"+
                                    "<th>"+childData.inputFields.EmployerPension+"</th>"+
                                    "<th>"+childData.inputFields.DaysOff+"</th>"+
                                    "<th>"+childData.inputFields.Convalescence+"</th>"+
                                    "<th>"+childData.inputFields.PremiumWage+"</th>"+
                                    "<th>"+childData.inputFields.Deduction+"</th>"+
                                    "<th>"+childData.inputFields.DeductionText+"</th>"+
                                    "<th><img src="+childData.paycheck+"alt='' height='10px' width='10px'/></th>"+
                                    "<th><img src="+childData.outPut+"alt='' height='10px' width='10px'/></th>"+
                                    "</tr>";
                        var key=childSnapshot.key;
                        database.ref("user/"+key+"/status").set("saved");
                    }
                });
            if(flag)
            {
                table+="</table>";
                $("#dvData").html(table);
                window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#dvData').html()));
            }
            if(!flag){
                alert("אין מידע לגיבוי");
                return false;
            }
        });
    }
    var adminSettings= function(){
        var content= "<div class='tab'>"+
                        "<button class='tablinks' id='defaultOpen'>משתנים</button>"+
                        "<button class='tablinks' id='showReportsId'>צפיה בדוחות</button>"+
                        "<button class='tablinks' id='showBackUP'>גיבוי</button>"+
                     "</div>"+
                     "<div id='changeValues' class='tabcontent'>"+
                        "<label>שכר מינימום לשעה:</label>"+
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
                        "<button id= 'buttonUpdateAdmin' class='buttonPopUp' type='button'>עדכן נתונים</button>"+
                     "</div>"+
                     "<div id='showReports' class='tabcontent'>"+
                        "<div class='form-style-9'>"+
                            "<label>חפש דוחות לפי אימייל לקוח:</label>"+
                            "<input type='text' id = 'txtFindForm' placeholder= 'אימייל'>"+
                            "<button id= 'buttonFindForm' type='button'>חפש</button>"+
                            "<div id='zoom' class='zoom'>"+
                                    "<img alt='' id='reset-zoomAdmin' height='25' src='./reset-zoom-icon.png' width='25'>"+
                                    "<img alt='' id='rotateAdmin' height='25' src='./rotate-icon.png' width='25'>"+
                                    "<img alt='' id='zoom-outAdmin' height='25' src='./zoom-out-icon.png' width='25'>"+
                                    "<img alt='' id='zoom-inAdmin' height='25' src='./zoom-in-icon.png' width='25'>"+
                            "</div>"+
                            "<div id ='container'>"+
                                "<img src='' id='loadFormAdmin' height='100%' width='100%'>"+
                            "</div>"+
                        "</div>"+
                        "</div>"+ 
                        "<div id='showBackUPText' class='tabcontent'>"+    
                            "<button id= 'buttonBackUp' type='button'>גבה נתונים</button>"+
                            "<button id= 'buttonDeleteSaved' type='button'>מחק</button>"+
                            "<div class='excel' id= 'dvData'></div>"+
                        "</div>"+  
                     "</div>";        
        $("#footerPopUp").html("");
        $("#containarPopUp").html(content);
        $("#txtSettingsMinHour").val(minHour);
        $("#txtSettingsMinMounth").val(minMonth);
        $("#txtSettingsWeekHours").val(weekHours);
        $("#txtTravelDay").val(travelDay);
        $("#txtDaysHolidayArray").val(daysHolidayArray);
        $("#txtDaysRecoveryArray").val(daysRecoveryArray);
        $('#buttonUpdateAdmin').click(updateAdminValues);
        $('#buttonFindForm').click(findEndForm);
        $('#buttonBackUp').click(backUp);
        $('#buttonDeleteSaved').click(deleteSaved);
         tabcontent = document.getElementsByClassName("tabcontent");
            tabcontent[1].style.display = "none";
            tabcontent[2].style.display = "none";
        $('#defaultOpen').click(function(){
            tabcontent = document.getElementsByClassName("tabcontent");
            tabcontent[1].style.display = "none";
            tabcontent[0].style.display = "block";
            tabcontent[2].style.display = "none";
            return false;
        });
        $('#showBackUP').click(function(){
            tabcontent = document.getElementsByClassName("tabcontent");
            tabcontent[0].style.display = "none";
            tabcontent[1].style.display = "none";
            tabcontent[2].style.display = "block";
            return false;
        });
        $('#showReportsId').click(function(){
            tabcontent = document.getElementsByClassName("tabcontent");
            tabcontent[0].style.display = "none";
            tabcontent[1].style.display = "block";
            tabcontent[2].style.display = "none";
            $('#zoom-inAdmin').click({msg: 'admin'},zoomIn); 
            $('#zoom-outAdmin').click({msg: 'admin'},zoomOut);
            $('#reset-zoomAdmin').click({msg: 'admin'},zoomReset);
            $('#rotateAdmin').click(rotate);   
            return false;
        });        
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
        var protectLoop= false;
        var database = firebase.database();
        var leadsRef = database.ref('user');
        leadsRef.on('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                if(!flag)
                {
                    var rand = Math.round(Math.random() * (30000 - 5000)) + 5000; // generate new time (between 3sec and 500"s)
                    setTimeout(myFunction, rand);
                    function myFunction(){                     
                    var childData = childSnapshot.val();
                    if(childData.status == "false")
                    {
                        var key=childSnapshot.key;
                        database.ref("user/"+key+"/status").set("true");
                        currentSnapshot= childSnapshot;
                        flag= true;
                        var preview = document.getElementById('pic'); //selects the query named img
                        preview.src = childData.paycheck;
                        currentEmail= childData.email;
                    }
                }
                }
             });
             if(!flag && !protectLoop){
                protectLoop= true;
                alert("אין טופס לבדיקה! ברגע שיעלה טופס חדש הוא יטען למערכת");
             }
        });
};
    var openProgress = function(){
        var flag= false;
        var list = $("#progress");
        list.empty();
        var database = firebase.database();
        var leadsRef = database.ref('user');
        leadsRef.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {                     
                var childData = childSnapshot.val();
                if(childData.status == "true")
                {
                    flag= true;
                    list.append(new Option(childData.email, childData.email));
                }
             });
             if(!flag)
                alert('אין טפסים בתהליך');
        });
        return false;
    };

    var uploadInProgress = function(){
        var database = firebase.database();
        var leadsRef = database.ref('user');
        leadsRef.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {                     
                var childData = childSnapshot.val();
                if($("#progress option:selected").text() == childData.email)
                {
                    currentSnapshot= childSnapshot;
                    currentEmail= childData.email;
                    var preview = document.getElementById('pic'); //selects the query named img
                    preview.src = childData.paycheck;
                }
             });
        });
    };

    var calc = function() {
        var goodOutPut= "נראה כי הרכיב תקין, אך לא ניתן לדעת זאת בוודאות ללא"+"<font color='blue'> בדיקה מלאה</font>";
        var allInput = $("Input");
        allInput.removeClass("error");
        var errorFlag=false;
        for(var i=0;i<allInput.length;i++){
            if(allInput[i].value==""){
                allInput[i].className+=" error";
                errorFlag=true;
            }
        }
        if(errorFlag==true)
            return(false);
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
        var deductionsText= ($("#selectDeductions option:selected").text());        // ניכויים מלל
        var deductionsAmount= parseFloat($("#txtInvalidDeduction").val());      // ניכויים סכום
        // פער משכר מינימום
        var minWageGap = 0;
        if(hourWage<minHour)
            minWageGap = Math.round((minHour-hourWage)*regularWorkHours);
        
        // פער משכר יסוד
        var basicWageGap = 0;
        if(hourWage<minHour)
            basicWageGap=minHour*regularWorkHours-regularPayment;
        else
        {
            if(hourWage*regularWorkHours>regularPayment)
                 basicWageGap=hourWage*regularWorkHours-regularPayment;
        }
        if (basicWageGap > 0)
        {
            salaryOutPut= "נראה כי המעסיק לא שילם לך שכר בסך "+ "<font color='red'>"+Math.round(basicWageGap)+"</font>";
            outPutSum+= basicWageGap;
        }
        else
            salaryOutPut= goodOutPut;
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
        {
            travelFeesLoss = daysOfWork*travelDay-travelPayment;
            travelFeesOutPut= "נראה כי המעסיק לא שילם לך עבור נסיעות בסך של "+ "<font color='red'>"+Math.round(travelFeesLoss)+"₪</font>";
            outPutSum+= travelFeesLoss;
        }
        else
            travelFeesOutPut= goodOutPut;
        // סה"כ הפסד על שעות נוספות
        var extraHouresLoss= 0;
        if(regularWorkHours == 187)
            extraHouresLoss= (extraHours125Pays+extraHours150Pays)-(hourWage*1.25);
        if(regularWorkHours == 188)
             extraHouresLoss= (extraHours125Pays+extraHours150Pays)-(hourWage*1.25*2);
        if(regularWorkHours > 188)
             extraHouresLoss= (extraHours125Pays+extraHours150Pays)-(hourWage*1.25*2)+((regularWorkHours-188)*1.5*hourWage);
        if(extraHouresLoss > 0)
        {
            extraHouresOutPut=  "נראה כי המעסיק לא שילם לך שעות נוספות בסך של "+ "<font color='red'>"+Math.round(extraHouresLoss)+"₪</font>";
            outPutSum+=extraHouresLoss;
        }
        else
            extraHouresOutPut= goodOutPut;

        // ימי חופשה נוספים שמגיעים לך
        var daysOffDeserve= 0;
        var daysOffSeniority= 0;
        if(seniorYears > 14)
            daysOffSeniority= 20;
        else
            daysOffSeniority= daysHolidayArray[seniorYears-1];
        if(accumulatedDaysOff < daysOffSeniority)
            daysOffDeserve= daysOffSeniority- accumulatedDaysOff;
        if(daysOffDeserve > 0)
            daysHolidayOutPut= "נראה כי קיימים ימי חופשה נוספים שמגיעים לך בסך של "+"<font color='red'>"+ daysOffDeserve+" ימים</font>";
        else
            daysHolidayOutPut= goodOutPut;
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
        if(daysRecoveryLoss > 0)
        {
            daysRecoveryOutPut=  "נראה כי התלוש אינו כולל דמי הבראה על סך "+ "<font color='red'>"+Math.round(daysRecoveryLoss)+"₪</font>";
            outPutSum+= daysRecoveryLoss;
        }
        else
            daysRecoveryOutPut= goodOutPut;
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
        // הפסד על דמי חבר וניכויים
        var deductionsLoss= 0;
        if(deductionsText == "אחר")
        {
            deductionsLoss= deductionsAmount;
            deductionsOutPut= "נראה כי הפסדת עבור ניכויים בסך של " + "<font color='red'>"+Math.round(deductionsLoss)+"₪</font>";
            outPutSum+= deductionsLoss;
        }
        else
            deductionsOutPut= goodOutPut;
        // פנסיה עובד רגילה+פרמיה
        var employeePensionSum= employeePensionGap+employeePremiumGap;
        if(employeePensionSum > 0)
        {
            employeePensionOutPut= "נראה כי המעסיק לא הפריש עבורך לפנסיה בסך של " + "<font color='red'>"+Math.round(employeePensionSum)+"₪</font>";
            outPutSum+= employeePensionSum;
        }
        else
            employeePensionOutPut= goodOutPut;
        // פנסיה הפרשת מעביד+פרמיה
        var employerPensionSum= employerPensionGap+employerPremiumGap;
        if(employerPensionSum > 0)
        {
            employerPensionOutPut= "נראה כי המעסיק לא הפריש עבורך לפנסיה בסך של " + "<font color='red'>"+Math.round(employerPensionSum)+"₪</font>";
            outPutSum+= employerPensionSum;
        }
        else 
            employerPensionOutPut= goodOutPut;
        inputFieldsObject = 
        {
            EmployeeName : $("#txtName").val(),
            Date :  $("#txtDate").val(),
            WorkDays: parseFloat($("#txtDaysOfWork").val()),
            HourlyWage: parseFloat($("#txtPayForHour").val()),
            Seniority: parseFloat($("#txtSeniorYears").val()),
            WorkHours: parseFloat($("#txtRegularWorkHours").val()), 
            RegularHoursPay: parseFloat($("#txtRegularPayment").val()),
            Pay125: parseFloat($("#txtEx125Payment").val()),
            Pay150: parseFloat($("#txtEx150Payment").val()),
            Travel: parseFloat($("#txtTravelPayment").val()),
            WorkerPension: parseFloat($("#txtWorkerPension").val()),
            EmployerPension: parseFloat($("#txtEmployerPension").val()),
            DaysOff: parseFloat($("#txtAccumulatedDaysOff").val()),
            Convalescence: parseFloat($("#txtConvalescencePay").val()),          
            PremiumWage: parseFloat($("#txtPremiumWage").val()), 
            Deduction: parseFloat($("#txtInvalidDeduction").val()),
            DeductionText: $("#selectDeductions option:selected").text()  
        }
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
        console.log("deductionsLoss= "+ deductionsLoss);
        fillOutput();
    };

    var zoomIn = function(e){
        if(e.data.msg == "pic")
        {
            $('#pic').width($('#pic').width()*1.2);
            $('#pic').height($('#pic').height()*1.2);
        }
        if(e.data.msg =="admin")
        {
            $('#loadFormAdmin').width($('#loadFormAdmin').width()*1.2);
            $('#loadFormAdmin').height($('#loadFormAdmin').height()*1.2);
        }
}

    var zoomOut = function(e){
        if(e.data.msg == "pic")
        {
            $('#pic').width($('#pic').width()/1.2);
            $('#pic').height($('#pic').height()/1.2);
        }
        if(e.data.msg =="admin")
        {
            $('#loadFormAdmin').width($('#loadFormAdmin').width()/1.2);
            $('#loadFormAdmin').height($('#loadFormAdmin').height()/1.2);
        }
    }

    var zoomReset = function(e){
        if(e.data.msg == "pic")
        {
            $('#pic').width("100%");
            $('#pic').height("100%");
        }
        if(e.data.msg =="admin")
        {
            $('#loadFormAdmin').width("100%");
            $('#loadFormAdmin').height("100%");
        }    
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

    var updateInputFields = function(){
        var database = firebase.database();
        var key=currentSnapshot.key;
        database.ref("user/"+key+"/inputFields").set(inputFieldsObject);
    }
    var fillOutput = function(){
        var values= $("input");
        var currentPaycheck= $("#pic");
        var currentPage=  $("body").html();
        var imgTlushiBase64= "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCATrCo8DASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAcIBgkBBAUCA//EAGEQAQABAgMCAw0RDAkDBAEEAwABAgMEBREGBxIhMQgTFTZBUVNVYXShstEUFxgiMjdmcXOBkZOUpbGz4xY1VFZydYKVwcLS0yMzNEJSYoOSoiTD4UNjtPCEJUSj8SZk4v/EABsBAQADAQEBAQAAAAAAAAAAAAAFBgcEAwEC/8QANBEBAAECAgUMAgMBAQEBAQAAAAECAwQFBhESNFITFBUWITFBUVNxkaFhgTIzsSJi8CNC/9oADAMBAAIRAxEAPwC1IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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oyDMasXRjK70zbm3wZo0iNZif2OPHZph71iqiie2Xbl2SYuxiabldPZDMgFXXoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//2Q==";
        var imgMoneyBase64= "data:image/png;base64,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";
        var imgClockBase64= "data:image/png;base64,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";
        var imgCarBase64= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHYAAAB2CAMAAAFdfqe1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAeUExURQAAAAUFBQgICAcHBwYGBgQEBAkJCQMDAwoKCgAAADMNMIsAAAAKdFJOU////////////wCyzCzPAAAACXBIWXMAACHVAAAh1QEEnLSdAAAEYklEQVRYR+1Z25biMAzjsfz/D68ly07SpCWFpbNnNgJS32QlaSkw83i2eMt/GOjR39zyw+O5bQ97ApuFstABdyuMjfVmEYigHFbJt/gJn4txF75PSoGHrdbXywWY7/GA+bFeNEFtLJdR9BOFdaET+NTf4YY0NsJ2g8+GYI52p4Rj7QbuzAhoaHu+gaVdrsCWJoXNYwqyAQ9gQp7BAEvwtL3KhFpI7Sgt/GD692Z1BttLSFmcYr/A2qsBWTLyXVjTzdTpTJJfVARvXOiJq4Vge106hbIDp7CbZANrQK4OBT53D8crYapoymzwCxCAMOfq2YT76OYTh11Nz98DmQUDRgCLQaBi1IjdoHOE/y17jsWdxz/BxRufb63qedI8U7xbwPP3ZyLCA3iYerQ6rgHZER0xpMjOZ32XwIRYgKiTBP8ewgLPk8pIInwm1JpcHa8BHeyWZl0UMHRLPQanElxNtr1xNfBtCYKRcV9zkwcYB+xUwXyDa0E09ATJI3QVeW1k02oGLaAjqCL9UEbDMfKMRJfkkgXIG8C6syI4FfcyFnceizuPxZ3H4s7jF3DxEd1A8SGaJG77+GCrnuVDqEeVYukASvdILmVgtMXGPZy44pR0cy+EzJjtUYjSMPSTLH1bgAJm6Tyog/JA2kKxRVzxaMMytOPjh58ywoBMqG81AX7lYcoTrIBZgVEeI+P8V9dOB+dyU3y8CKj7RilwDSBX37iwABmvYcq1rm/EKR15FTRcEJE7XkNUyOHu01YT4x4pg+f75B5PHc3UU68OISLDNIxKnaKGaY+hApBRZCuPSiWQwfWzfzQVUMR34CluU2GuHzmCIaOyWpxxlYpEh5rrrGqLmLN4hlr03Uuh70D0HEA5rF8BPwDI2UveANgv7pv8Q5URwCvLvsbdYXHnsbjzWNx5fML9AEv2BizZG7Bkb8CSvQFL9gacyOJ31itc/KGdOKC5IsZiHY3vSA8o+HXiHT3J9rR6MIeH/Fns67kIqipwLmtgtVVcUq6LeTJbSYBNZY+RvGnpLMwLSH4Bgq/7ufTsdqsq5uteizlZAztgza//ksQ8al3Wx2Jp5DIUGGLH8NoTfQuzOJuyPq3w43GEmmGoqRg6ffwL0SDvLwOK6N7oM+NXEs0vwkS4V3wyANmDE/AFcMl2vFnW1w1Z6CpWgFmh4NMZ9X8B4qVJ2X1OgnhiTv2kZkCm821UEGBju5KhXkGCtF23n/IrsIMLBpTRcvmX3kq3lyFX9iRAqZpQNn2kTLAtoaxsoS2YANruCIgwxP5YLS22ltFJVKmpFwZRE0oqjZuj1ymEUZWJmNLcy8bB5kQHZOEqFA8MrKvAjOwJoFxmwa7xvh2UdyQQ+j7HQHlXD9kq2K3CVHnGA2xyRXU4dYs0U+83D7J8sdgdpWYBWr2l3kUO0ctqtj7wqPAFkIYX98pNpRwjWYOKbVTgKipVjIom3m07hcH9Xviq7DGW7A1Ysjdgyd6AJXsDluzX8Xz+AUnNzTrrksoYAAAAAElFTkSuQmCC";
        var imgOldManBase64= "data:image/jpeg;base64,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";
        var imgUndoBase64= "data:image/png;base64,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";
        var imgSizBase64= "data:image/png;base64,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";
        var imgHolidayBase64= "data:image/png;base64,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";
        var imgNoteBase64= "data:image/png;base64,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";
        var outPutSumText;
        if(outPutSum > 0)
            outPutSumText =  "<font color='red'>"+" נראה כי הנך זכאי\ת ל: "+Math.round(outPutSum)+"₪ נוספים בתלוש המשכורת כל חודש!</font>";
        else
            outPutSumText= " נראה כי תלוש המשכורת שלך תקין!";
        text=
            "<div class='output' dir='rtl'>"+
            "<img class='homeButton' id='homePageButton' src='./back.png'>"+
            "<img class= 'tlushiLogo' src="+imgTlushiBase64+" height='90px' width='180px'>"+
                "<table cellpadding='0' cellspacing='0' border='0'>"+
                "<tbody>"+
                "<tr>"+
                    "<td>"+
                        "<div>"+
                            "<p align='center' style='font-size:25px;' dir='rtl'>"+
                            "תלוש השכר שלך במילים פשוטות"+
                            "</p>"+
                        "</div>"+
                    "</td>"+
                "</tr>"+
                "</tbody>"+
                "</table>"+
                "<p align='center' style='font-size:20px;' dir='rtl'>"+
                "<strong><u>מה בדקנו:</u></strong>"+
                "</p>"+
                "<div align='right' dir='rtl'>"+
    "<table dir='rtl' border='2' cellspacing='0' cellpadding='0'>"+
            "<tr>"+
                "<td class='tdImg' valign='top'>"+
                     "<img src="+imgMoneyBase64+" height='45px' width='45px'>"+
                "</td>"+
                "<td class='tdExp'>"+
                    "<p align='right' dir='RTL'>"+
                        "שכר"+
                    "</p>"+
                        salaryOutPut+
                "</td>"+
            "</tr>"+
            "<tr>"+
                "<td class='tdImg' valign='top'>"+
                     "<img src="+imgClockBase64+" height='45px' width='45px'>"+                
                "</td>"+
                "<td class='tdExp'>"+
                    "<p align='right' dir='RTL'>"+
                        "תשלום על שעות נוספות"+
                    "</p>"+
                        extraHouresOutPut+
                "</td>"+
            "<tr>"+
                "<td class='tdImg' valign='top'>"+
                     "<img src="+imgCarBase64+" height='45px' width='45px'>"+                
                "</td>"+
                "<td class='tdExp'>"+
                    "<p align='right' dir='RTL'>"+
                        "נסיעות"+
                    "</p>"+
                    "<p align='right' dir='RTL'>"+
                        travelFeesOutPut+
                    "</p>"+
                "</td>"+
            "</tr>"+
            "<tr>"+
                "<td class='tdImg' valign='top'>"+
                   "<img src="+imgOldManBase64+" height='45px' width='45px'>"+
                "</td>"+
                "<td class='tdExp'>"+
                    "<p align='right' dir='RTL'>"+
                        "הפרשה לפנסיה"+
                    "</p>"+
                    "<p align='right' dir='RTL'>"+
                        "<strong>עובד </strong>"+
                        employeePensionOutPut+
                    "</p>"+
                    "<strong>מעביד </strong>"+
                     employerPensionOutPut+
                "</td>"+
            "</tr>"+
            "<tr>"+
                "<td class='tdImg' valign='top'>"+
                "<img src="+imgUndoBase64+" height='45px' width='45px'>"+
                "</td>"+
                "<td class='tdExp'>"+
                    "<p align='right' dir='RTL'>"+
                        "דמי הבראה"+
                    "</p>"+
                    "<p align='right' dir='RTL'>"+
                       daysRecoveryOutPut+
                    "</p>"+
                "</td>"+
            "</tr>"+
            "<tr>"+
                "<td class='tdImg' valign='top'>"+
                     "<img src="+imgSizBase64+" height='45px' width='45px'>"+                
                "</td>"+
                "<td class='tdExp'>"+
                    "<p align='right' dir='RTL'>"+
                        "<strong>ניכויי רשות</strong>"+
                    "</p>"+
                    "<p align='right' dir='RTL'>"+
                       deductionsOutPut+
                    "</p>"+
                "</td>"+
            "</tr>"+
            "<tr>"+
                "<td class='tdImg' valign='top'>"+
                      "<img src="+imgHolidayBase64+" height='45px' width='45px'>"+               
                "</td>"+
                "<td class='tdExp'>"+
                    "<p align='right' dir='RTL'>"+
                        "חופשה"+
                    "</p>"+
                    "<p align='right' dir='RTL'>"+
                       daysHolidayOutPut+
                    "</p>"+
                "</td>"+
            "</tr>"+
            "<tr>"+
                "<td width='554' colspan='2'>"+
                    "<p align='center' dir='RTL'>"+
                        "<u>סיכום</u>"+
                        outPutSumText+
                    "</p>"+
                "</td>"+
            "</tr>"+
    "</table>"+
"</div>"+
"<p dir='RTL'>"+
    "<u></u>"+
"</p>"+
 "<p align='center' style='font-size:20px;' dir='rtl'>"+
    "<strong><u>מה לא בדקנו:</u></strong>"+
"</p>"+
"<div align='right' dir='rtl'>"+
    "<table dir='rtl' border='0' cellspacing='0' cellpadding='0' width='558'>"+
        "<tbody>"+
            "<tr>"+
                "<td width='558'>"+
                    "<p align='right' dir='RTL'>"+
                        "<img src="+imgNoteBase64+" height='22px' width='37px'>"+
                        "<strong>אימות הנתונים והניתוח באופן ודאי ועל פי נתונים אישיים</strong>"+
                    "</p>"+
                "</td>"+
            "</tr>"+
            "<tr>"+
                "<td width='558'>"+
                    "<p align='right' dir='RTL'>"+
                        "<img src="+imgNoteBase64+" height='22px' width='37px'>"+
                        "<strong>בחינה שנתית של הניתוח</strong>"+
                    "</p>"+
                "</td>"+
            "</tr>"+
            "<tr>"+
                "<td width='558'>"+
                    "<p align='right' dir='RTL'>"+
                        "<img src="+imgNoteBase64+" height='22px' width='37px'>"+
                        "<strong>התאמה של הנתונים לדוח השעות</strong>"+
                    "</p>"+
                "</td>"+
            "</tr>"+
            "<tr>"+
                "<td width='558'>"+
                    "<p align='right' dir='RTL'>"+
                        "<img src="+imgNoteBase64+" height='22px' width='37px'>"+
                        "<strong>צבירת ימי מחלה</strong>"+
                    "</p>"+
                "</td>"+
            "</tr>"+
            "<tr>"+
                "<td width='558'>"+
                    "<p align='right' dir='RTL'>"+
                        "<img src="+imgNoteBase64+" height='22px' width='37px'>"+
                        "<strong>ביטוח לאומי</strong>"+
                    "</p>"+
                "</td>"+
            "</tr>"+
        "</tbody>"+
    "</table>"+
"</div>"+
"<table cellpadding='0' cellspacing='0' width='100%'>"+
    "<tbody>"+
        "<tr>"+
            "<td>"+
                "<div>"+
                    "<p align='right' dir='RTL'>"+
                        "<u>הבהרה</u>"+
                        ":"+
                    "</p>"+
                    "<p align='right' dir='RTL'>"+
                        "הנתונים המופיעים בדוח אינם מהווים ייעוץ משפטי או"+
                        " חשבונאי או ייעוץ מכל סוג שהוא, אלא סיכום של ניתוח"+
                        " נתונים המבוסס על תלוש משכורת אחד, אשר אין בידו לספק"+
                        " תמונה שלמה של זכויות העובד ומילוין על ידי המעסיק."+
                        "</br>"+
                        "ייתכן שהתלוש שנשלח מכיל סעיפים נוספים שלא נבדקו על"+
                        " ידנו, וייתכן כי בסעיפים האלה מסתתר ההפרש שמגיע לך. חשוב"+
                        " לציין, כי ציון סעיפים בצורה לא מובנת הוא עבירה על החוק"+
                        " וניתן לקבל עבורו פיצויים על פי חוק."+
                        "</br>"+                    
                        "בדיקה מהימנה ומקיפה של התלוש וזכויות העובד\ת תוכל"+
                        " להתבצע רק לאחר שליחת נתונים שנתיים מלאים."+
                        "</br>"+
                        "לשאלות ובירורים בנוגע לתוצאות ניתן לפנות אלינו במייל:"+
                        " info@tlooshy.com."+
                    "</p>"+
                "</div>"+
            "</td>"+
        "</tr>"+
    "</tbody>"+
"</table>"+
"<table cellpadding='0' cellspacing='0' width='100%'>"+
    "<tbody>"+
        "<tr>"+
            "<td>"+
                "<div>"+
                    "<p align='right' dir='RTL'>"+
                        "<u>זיהוי משתמש: "+currentEmail+"</u>"+
                    "</p>"+
                "</div>"+
            "</td>"+
        "</tr>"+
    "</tbody>"+
"</table>"+
"</div>"+
                "<button id = 'save' class='form-style-9'>שמור</button>"+
            "</div>";
        $("body").html(text);
        $("#homePageButton").click(function(){
            $("body").html(currentPage);
            var input= $("input");
            for(var i=2; i<18; i++)
                input[i].value=values[i].value;
            $("#pic").src= currentPaycheck.src;
            return false;
        });
        $("#save").click(function(){
            document.getElementById('save').style.visibility='none';
            document.getElementById('homeButton').style.display='hidden';
            html2canvas(document.body, 
            {
                           background:'#fff',
                           onrendered: function(canvas) 
                           {           
                                var data = canvas.toDataURL("image/png", 1);
                                //window.open(data); 
                                // Send output to email!!!!
                                var base64result = data.split(',')[1];
                                let storageRef = firebase.storage().ref();
                                var key=currentSnapshot.key;
                                storageRef.child('output/'+key+'.png')
                                 .putString(base64result, 'base64', { contentType: 'image/png' }).then((savedPicture) => {
                                    // update output field
                                    var database = firebase.database();
                                    database.ref("user/"+key+"/outPut").set(savedPicture.downloadURL);
                                    updateInputFields();
/*                                    emailjs.send("diabetesappjce","tlushi",{to_email: currentEmail, paycheck_output: savedPicture.downloadURL})
                                    .then(function(response) {
                                        // status = done
                                        database.ref("user/"+key+"/status").set("done");
                                        alert("email send")
                                    }, function(err) {
                                        alert("FAILED. error=", err);
                                    });   
                                    location.reload(); 
  */                              });
                           }
            });
            document.getElementById('save').style.visibility='visible';
            document.getElementById('homeButton').style.visibility='block';
});
    }

    return {
        initModule : initModule,
    };
}();

$(document).ready(employeeAPI.initModule);

