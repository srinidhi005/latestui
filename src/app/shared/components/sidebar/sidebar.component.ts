import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RMIAPIsService } from '../../rmiapis.service';
import { UrlConfigService } from '../../url-config.service';
import { UserDetailModelService } from '../../user-detail-model.service';
interface ITopCompanies {
  companyName: string;
  scenarios: any[];
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  scenarioArray: any = [];
  topCompanies: ITopCompanies[] = [];
  TopCompaniesSubscription: Subscription;
  constructor(
    private userDetailModelService: UserDetailModelService,
    private apiService: RMIAPIsService,
    private urlConfig: UrlConfigService,
    private router: Router
  ) {}

  ngOnInit() {
    this.scenarioArray = this.userDetailModelService.getScenarioNumber();
    this.getCompanies();
  }
  /**
   *
   */
  scenarioNumber() {
    this.scenarioArray = this.userDetailModelService.getScenarioNumber();
  }
  /**
   * Get top companies
   */
  getCompanies = (): void => {
    this.TopCompaniesSubscription = this.apiService
      .getData(this.urlConfig.getTopCompaniesAPI())
      .subscribe((res: any) => {
        this.topCompanies = res.data || [];
      });
  };
  displayBalSheetScenario(scenarioNumber) {
    console.log('scenarioNumber', scenarioNumber);
    this.userDetailModelService.setBalanceSheetScenario(scenarioNumber);
    this.router.navigate(['/visualsBS']);
  }
  displayIncomeSheetScenario(scenarioNumber) {
    console.log('scenarioNumber', scenarioNumber);
    this.userDetailModelService.setIncomeSheetScenario(scenarioNumber);
    this.router.navigate(['/visualsIS']);
  }
  ngOnDestroy() {
    if (this.TopCompaniesSubscription) {
      this.TopCompaniesSubscription.unsubscribe();
    }
  }
}