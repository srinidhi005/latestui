import {Component,OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { RMIAPIsService } from '../../shared/rmiapis.service';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import {UserDetailModelService} from 'src/app/shared/user-detail-model.service';
import { MatDialog} from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
export interface PeriodicElement {
  name: string;
  position: number;
  company: string;
  industry: string;
  createdOn:any;
  createdBy:string;
  download:string;
  delete:string;
  filename:any;
}
const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StatementComponent implements OnInit {
  progressBar:boolean;
  dataset:any = [];
  downloadLink:any;
  downloadAction:any;
  url:string;
  statementResponse:any;
  expandedElement: PeriodicElement | null;
  displayedColumns: string[] = ['position', 'name', 'company', 'industry','createdOn','createdBy','download','delete'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('downloadForm',{static:true}) downloadForm:any;
  public downloadGroup = this.formBuilder.group({
  });
  constructor(
    private apiService:RMIAPIsService,
    private userDetailModelService:UserDetailModelService,
    private urlConfig:UrlConfigService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    
    this.progressBar=true;
    this.dataSource.paginator = this.paginator;
    this.apiService.getData(this.urlConfig.getStatementAPI()).subscribe((res:any)=>{
    const data = res.map((el,index)=>({...el,position:index+1,action:null}));
    this.dataset=data;
    for (let index=0; index<=data.length;index++){
      var pushData = {
          position:index+1,
          name:data[index].companyname,
          company:data[index].company,
          industry:data[index].industry,
          createdOn:data[index].createdon,
          createdBy:data[index].createdby,
          download:'download',
          delete:'delete',
          filename:data[index].filename,
    }
    ELEMENT_DATA.push(pushData);
    this.dataSource._updateChangeSubscription();
    this.progressBar=false;
          }
      });
  }
   deleteDialogBox(element:any){
    const dialogRef =  this.dialog.open(DialogElementsExampleDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result==true){
        this.deleteStatement(element);
      }
    });
        this.ngOnInit();
    
  }
  deleteStatement(element:any){
    this.apiService.getData(this.urlConfig.getDeleteStatementAPI()+element.name).subscribe((res:any)=>{
      ELEMENT_DATA.splice(element.position-1, 1);
    this.dataSource._updateChangeSubscription();
    this.dataSource._renderChangesSubscription;      
  });
  
  }

  downloadStatement(element:any){
    this.downloadAction =this.urlConfig.getDownloadStatementAPI()+element.name;
    this.downloadForm.nativeElement.submit();
  }

  loadvisualsIS(){
    this.userDetailModelService.getSelectedCompany();
  }
  incomeStatement(element:any){
    this.userDetailModelService.setSelectedCompany(element.name);
    this.userDetailModelService.setSelectedScenario(1);
  }
  balanceStatement(element:any){
    this.userDetailModelService.setSelectedCompany(element.name);
    this.userDetailModelService.setSelectedScenario(1);
  }
}

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'dialogbox.html',
  styleUrls: ['./statement.component.scss']
})
export class DialogElementsExampleDialog {
}
