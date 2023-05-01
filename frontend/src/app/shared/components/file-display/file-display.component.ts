import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FileType, PublicFile } from '@corbado/models/public-file.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SpaceService } from 'src/app/services/space.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'ho-file-display',
  templateUrl: './file-display.component.html',
  styleUrls: ['./file-display.component.scss'],
})
export class FileDisplayComponent implements OnInit {

  @Input() showThumbnail = true;
  @Input() content = false;
  @Input() fileData: PublicFile | undefined;
  @Input() editMode = false;
  @Input() link = '';

  @Output() removeFileReq = new EventEmitter<null>();
  @Output() linkClicked = new EventEmitter<string>();

  @ViewChild('iframe', {static: false}) iframe: ElementRef | undefined;
  @ViewChild('pdfViewer', {static: false}) pdfViewer: PdfViewerComponent | undefined;

  fileType: FileType = '';
  pdfViewerStyle = {width: '100%', height: '380px'};
  scrollMarginPx = 370;
  topOfPDF = true;
  bottomOfPDF = false;
  test: any = {};
  test2: any = {};
  helperText = '';
  displayLink: SafeResourceUrl | undefined;
  linkPreviewAvailable = false;
  linkPreviewData: any;
  linkStyle = {};
  pdfURL = '';
  pdfURL2 = '';

  constructor(
    private feedService: SpaceService,
    private utils: UtilsService,
    private notif: NotificationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.helperText = this.editMode ? 'click to remove file' : 'click to open file';
    if (this.fileData?.name?.endsWith(".pdf")) {
      this.fileType = 'pdf';
      this.helperText = this.editMode ? 'click to remove file' : 'PDF';
      if (!this.editMode) {
        // @ts-ignore
        this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileData?.url.slice(0, -8) + 'pdf');
        this.pdfURL2 = this.fileData?.url.slice(0, -8) + 'pdf';
      }
    } else if (
      this.fileData?.name?.endsWith(".png") ||
      this.fileData?.name?.endsWith(".PNG") ||
      this.fileData?.name?.endsWith(".jpg") ||
      this.fileData?.name?.endsWith(".JPG") ||
      this.fileData?.name?.endsWith(".gif") ||
      this.fileData?.name?.endsWith(".jpeg") ||
      this.fileData?.name?.endsWith(".JPEG")) {
      this.fileType = 'img';
      this.helperText = this.editMode ? 'click to remove image' : 'Image';
    } else {
      this.fileType = 'link';
      this.helperText = this.editMode ? 'click to remove link' : 'Link';
      this.feedService.getLinkPreviewData(this.link).subscribe((res) => {
        if (res.title) {
          this.linkPreviewData = res;
          this.linkPreviewAvailable = true;
        } else {
          console.log(`Problem with url: ${this.link}`);
        }
        this.notif.stopNotification();
      });
    }
  }

  onPDFEndLoad(_e: any) {
    if (this.pdfViewer) {
      this.pdfViewer.pdfViewerContainer.nativeElement.addEventListener('scroll', (e: any) => this.onPDFScroll(e));
      if (this.pdfViewer.pdfViewerContainer.nativeElement.firstChild.clientHeight < 380) {
        this.pdfViewerStyle = {height: (this.pdfViewer.pdfViewerContainer.nativeElement.firstChild.clientHeight + 10) + 'px', width: '100%'};
        this.topOfPDF = false;
      }
    };
  }

  sessionAlreadyScrolled = false;
  onPDFScroll(_e: any) {
    this.topOfPDF = false;
    this.bottomOfPDF = false;

    if (!this.sessionAlreadyScrolled) {
      this.sessionAlreadyScrolled = true;
      if (this.fileData?.id) this.utils.updateFileViewCount(parseInt(this.fileData.id + '')).subscribe(_res => this.notif.stopNotification());
      
    }

    if (this.pdfViewer?.pdfViewerContainer.nativeElement.scrollTop < 10) {
      this.topOfPDF = true;
      this.test = {
        zIndex: 15,
        bottom: '10px',
      }
    } else if (
      this.pdfViewer?.pdfViewerContainer.nativeElement.scrollTop + this.scrollMarginPx >= 
      this.pdfViewer?.pdfViewerContainer.nativeElement.firstChild.clientHeight
    ) {
      this.bottomOfPDF = true;
    }
  }

  handleClick(): void {
    if (this.editMode) {
      this.removeFileReq.emit();
    } else {
      if (this.fileType === 'link') {
        //
        this.linkClicked.emit(this.link);
        let targetLink = this.link;
        if (!(this.link.startsWith('http://') || this.link.startsWith('https://'))) {
          // link MUST start with http otherwise the browser thinks it's a relative path inside the same domain
          targetLink = 'http://' + this.link;
        }
        window.open(targetLink, "_blank");
      } else {
        if (this.fileType === 'pdf') {
          window.open(this.fileData?.url.slice(0, -8) + 'pdf', "_blank");
        } else {
          window.open(this.fileData?.url, "_blank");
        }
      }
    }
  }

  onImgError(_arg?: any): void {
    this.linkPreviewData.image = '';
  }

  remove(): void {
    if (this.editMode) {
      this.removeFileReq.emit();
    }
  }
}
