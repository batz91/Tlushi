var employeeAPI = function() {

//	Create the initial appearance of the site
	var initModule = function() {
		$("#butCalc").click(calc);
        $("#fileInput").change(previewFile);
        $('#zoom-in').click(zoomIn); 
        $('#zoom-out').click(zoomOut);
    };

    var calc = function() {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var a = fso.CreateTextFile("c:\\testfile.txt", true);
        a.WriteLine("This is a test.");
        a.Close();
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
   };

   var WriteToFilefunction = function() {
        var fso = CreateObject("Scripting.FileSystemObject");  
        var s = fso.CreateTextFile("‏‏שולחן העבודה\test.txt", True);
        s.writeline("HI");
        s.writeline("Bye");
        s.writeline("-----------------------------");
        s.Close();
        return;
    };

    return {
        initModule : initModule,
    };
}();

$(document).ready(employeeAPI.initModule);