import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatPage } from './chat.page';

const routes: Routes = [
  {
    path: '',
    component: ChatPage,
  },
  {
    path: 'image-view',
    loadChildren: () => import('./image-view/image-view.module').then( m => m.ImageViewPageModule)
  },
  {
    path: 'gallery-view',
    loadChildren: () => import('./gallery-view/gallery-view.module').then( m => m.GalleryViewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatPageRoutingModule {}
