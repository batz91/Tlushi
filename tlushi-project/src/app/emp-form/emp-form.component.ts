import { Component, OnInit  } from '@angular/core';

@Component({
  selector: 'app-emp-form',
  templateUrl: './emp-form.component.html',
  styleUrls: ['./emp-form.component.css']
})
export class EmpFormComponent implements OnInit {

  

  constructor() {
    
   }
  
  ngOnInit() {
      
  }

  previewFile(){

        var preview = document.querySelector('img'); //selects the query named img
        var input: any = document.getElementById('fileInput');
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

   calc(txtName
		, txtGlobalHours
		, txtDate
		, txtDaysOfWork
		, txtPayForHouer
		, txtSeniorYears
		, txtSeniorMounths
		, txtRegularWorkHours
		, txtRegularPayment
		, txtEx150WorkHours
		, txtEx150Payment
		, txtTravelPayment
		, txtWorkerPension
		, txtEmployePension
		, txtCompensationFund
		, txtUsedDaysOff
		, txtPayForFaysOff
		, txtAccumulatedDaysOff
		, txtHolidaysPay
		, txtConvalescencePay
		, txtSicksDays
		, txtSicksDaysPays
		, txtInvalidDeduction){

        var standart_month_hours=186;
        var standart_week_hours=43;              // check

        var month_extra_hours="";

        if(txtGlobalHours-standart_month_hours<=8 && txtGlobalHours-standart_month_hours>0)
        {}


        
   }
   

  
}
