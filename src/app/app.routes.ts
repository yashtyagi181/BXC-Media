import { Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';  
import { HomeComponent } from './home/home.component';
import { TermsComponent } from './pages/terms/terms.component';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';
import { CaseStudiesComponent } from './case-studies/case-studies.component';
import { CaseStudiesDetailedComponent } from './case-studies-detailed/case-studies-detailed.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about-us',component: AboutComponent},
    { path: 'projects', component: ProjectsComponent},
    { path: 'case-studies', component: CaseStudiesComponent},
    { path: 'case-studies-detailed/:slug', loadComponent: () => import('./case-studies-detailed/case-studies-detailed.component').then(m => m.CaseStudiesDetailedComponent) },
    { path: 'privacy-policy', component: PrivacyPolicyComponent},
    { path: 'terms', component: TermsComponent},
    { path: '**', redirectTo: '' }
];
