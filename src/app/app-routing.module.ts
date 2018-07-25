import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';

const routes: Routes = [
  // {
  //   path: 'settings',
  //   loadChildren: './settings/settings.module#SettingsModule'
  // },
  // {
  //   path: 'profile',
  //   loadChildren: './profile/profile.module#ProfileModule'
  // }
  // {
  //   path: 'editor',
  //   loadChildren: './editor/editor.module#EditorModule'
  // },
  // {
  //   path: 'article',
  //   loadChildren: './article/article.module#ArticleModule'
  // }
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preload all modules; optionally we could
    // implement a custom preloading strategy for just some
    // of the modules (PRs welcome ðŸ˜‰)
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
