declare var bootstrap: any;
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import data from '../data/promptData.json';
import { Configuration, OpenAIApi } from 'openai';
import { HttpClient } from '@angular/common/http';
import { EnvServiceService } from './env-service.service';
import { ClipboardService } from 'ngx-clipboard';
/* import * as bootstrap from 'bootstrap';*/
import Modal from 'bootstrap/js/dist/modal';
import Tooltip from 'bootstrap/js/dist/tooltip';
/* import { Toast } from 'bootstrap'; */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'id-assist';
  promptData = data.prompt;
  showInput: boolean = true;
  showOutput: boolean = false;
  totalWords: number = 0;
  wordCount: any;

  inputTextStr: string = '';
  outputTextStr: string = '';
  outputResponse: any;
  maxWords: number = 1000;
  currentPromptData: string = '';
  currentPromptBtn: string = '';
  showLoader: boolean = false;
  secretToken: string = '';
  testToken: string =
    '#1212#sk-iSwTwSy8NXDN7afXsebpT3Blbk#1212#FJUCoHbGUuxeba0gG4eA0n#1212#';

  currInputHelpText: string = '';
  toastMsg: any;
  message: string = '';

  toastElemObj: any;
  temperature: number = 0.7;
  max_tokens: number = 500;
  top_p: number = 1;
  frequency_penalty: number = 2;
  presence_penalty: number = 0;

  orig_temperature: number = 0.7;
  orig_max_tokens: number = 500;
  orig_top_p: number = 1;
  orig_frequency_penalty: number = 2;
  orig_presence_penalty: number = 0;

  configModal: any;

  /* @ViewChild('myToast') toastEl!: ElementRef; */

  constructor(
    private http: HttpClient,
    private envService: EnvServiceService,
    private clipboardApi: ClipboardService
  ) {}

  ngOnInit() {
    const myModal: any = document.getElementById('openAiConfigsModal');
    this.configModal = new Modal(myModal);
    // this.toastElemObj = new Toast(this.toastEl.nativeElement, {});
    this.getAPIData();
    // this.fetchSecretKey();
    this.loadEnv();
    this.setPromptData(this.promptData[0].data, 'btn0');
  }

  fetchSecretKey() {
    this.envService.getSecretKey().subscribe((res) => {
      console.log(res);
    });
  }
  loadEnv() {
    this.envService.getEnv().subscribe((res) => {
      console.log(res);
      this.secretToken = res;
    }),
      () => {
        console.log('CanÂ´t find the backend URL, using a failover value');
        sessionStorage.setItem('url_backend', 'https://failover-url.com');
      };
  }
  getAPIData() {
    /*  try {
      this.http
        .get(`${window.location.origin}/config-vars`)
        .subscribe((response: any) => {
          if (response.data) {
            console.log('success');
            //add code to use api data
          }
        });
    } catch (error) {
      console.log('error');
      //catch error
    } */
    this.envService.getKEyFromNode().subscribe((res) => {
      console.log(res);
    });
  }

  selectTab(tabName: string) {
    if (tabName === 'input') {
      this.showInput = true;
      this.showOutput = false;
    } else {
      this.showInput = false;
      this.showOutput = true;
    }
  }

  wordCounter(str: string, e: any) {
    const ev = <KeyboardEvent>event;
    this.wordCount = str ? str.split(/\s+/) : 0;
    this.totalWords = this.wordCount ? this.wordCount.length : 0;
    if (this.totalWords > this.maxWords) {
      const ctrlDown = e.ctrlKey;
      if (e.keyCode == 8 || e.keyCode == 46 || (ctrlDown && e.keyCode == 88)) {
      } else {
        ev.preventDefault();
      }
    }
  }
  setPromptData(promptData: string, currentBtn: string) {
    //this.inputTextStr = '';
    this.currentPromptData = promptData;
    this.currentPromptBtn = currentBtn;
  }
  configuration = new Configuration({
    apiKey: this.testToken.replace(/#1212#/g, ''),
  });
  openai = new OpenAIApi(this.configuration);

  async generateOutput() {
    this.showLoader = true;
    try {
      const completion = await this.openai.createCompletion(
        'text-davinci-001',
        {
          prompt:
            this.currentPromptData +
            '\n------\n' +
            this.inputTextStr +
            '\n------',
          temperature: Number(this.temperature),
          max_tokens: Number(this.max_tokens),
          top_p: Number(this.top_p),
          frequency_penalty: Number(this.frequency_penalty),
          presence_penalty: Number(this.presence_penalty),
        }
      );
      this.outputResponse = completion;
      this.outputTextStr = this.outputResponse.data.choices[0].text;
      this.outputTextStr = this.outputTextStr.replace(/^\s+|\s+$/g, '');
      this.showLoader = false;
      this.selectTab('output');
    } catch (error: any) {
      console.log(error);
      this.showLoader = false;
    }
  }

  copyContent() {
    this.clipboardApi.copyFromContent(this.outputTextStr);
    this.message = 'Content is copied to clipboard';
    //return !this.toastEl.nativeElement.classList.contains('show');
  }

  openModal() {
    this.orig_temperature = this.temperature;
    this.orig_max_tokens = this.max_tokens;
    this.orig_top_p = this.top_p;
    this.orig_frequency_penalty = this.frequency_penalty;
    this.orig_presence_penalty = this.presence_penalty;
    this.configModal.show();
    //this.configModal.
    // const modalRef = this.modalService.open(ModalContentComponent);
    // modalRef.componentInstance.user = this.user;
  }

  saveModalChanges() {
    this.configModal.hide();
  }
  discardModalChanges() {
    this.configModal.hide();
    this.temperature = this.orig_temperature;
    this.max_tokens = this.orig_max_tokens;
    this.top_p = this.orig_top_p;
    this.frequency_penalty = this.orig_frequency_penalty;
    this.presence_penalty = this.orig_presence_penalty;
  }
}
