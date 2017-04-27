var employeeAPI = function() {
//  VARIABLES 
    var minimumWage = 30;   // שכר מינימום
    var fare = 7;   // תעריך נסיעה  

//	Create the initial appearance of the site
	var initModule = function() {
		$("#butCalc").click(calc);
        $("#fileInput").change(previewFile);
        $('#zoom-in').click(zoomIn); 
        $('#zoom-out').click(zoomOut);
    };

    var calc = function() {
        fillOutput();
    };

    var zoomIn = function(){
        $('#pic').width($('#pic').width()*1.2)
        $('#pic').height($('#pic').height()*1.2)
    }

      var zoomOut = function(){
        $('#pic').width($('#pic').width()/1.2)
        $('#pic').height($('#pic').height()/1.2)
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