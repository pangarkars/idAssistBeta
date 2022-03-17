import { AfterViewInit, Component, OnInit } from '@angular/core';
import data from '../data/promptData.json';
import { Configuration, OpenAIApi } from 'openai';
import { HttpClient } from '@angular/common/http';
import { EnvServiceService } from './env-service.service';
import { ClipboardService } from 'ngx-clipboard';
import Modal from 'bootstrap/js/dist/modal';
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
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
    '#1212#sk-0rof1dxvSSoRyrF2oV5iT3B#1212#lbkFJBoOddDpWxHzR6WMNwFdY#1212#';

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
  errorToastMsgBox: any;
  toastMsgBox: any;
  selectedPromptIndex: number = 0;

  /* @ViewChild('myToast') toastEl!: ElementRef; */

  constructor(
    private http: HttpClient,
    private envService: EnvServiceService,
    private clipboardApi: ClipboardService
  ) {}

  ngOnInit() {
    // this.toastElemObj = new Toast(this.toastEl.nativeElement, {});
    this.getAPIData();
    // this.fetchSecretKey();
    this.loadEnv();
  }

  ngAfterViewInit() {
    const myModal: any = document.getElementById('openAiConfigsModal');
    this.configModal = new Modal(myModal);

    const errorToast: any = document.getElementById('errorToast');
    this.errorToastMsgBox = bootstrap.Toast.getOrCreateInstance(errorToast);

    const msgToast: any = document.getElementById('messageToast');
    this.toastMsgBox = bootstrap.Toast.getOrCreateInstance(msgToast);

    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    this.setPromptData(this.promptData[0].data, 'btn0', 0);
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
      this.message = 'Please restrict the word count to 1000 words';
      this.errorToastMsgBox.show();
      const ctrlDown = e.ctrlKey;
      if (e.keyCode == 8 || e.keyCode == 46 || (ctrlDown && e.keyCode == 88)) {
      } else {
        /* var text = str.split(' '); // grabs the text and splits it
        while (text.length > this.maxWords) {
          text.pop(); // remove the last word
        }
        this, (this.inputTextStr = text.join(' ')); */
        ev.preventDefault();
      }
    }
  }
  setPromptData(promptData: string, currentBtn: string, index: number) {
    //this.toastMsgBox.show();
    //this.inputTextStr = '';
    this.currentPromptData = promptData;
    this.currentPromptBtn = currentBtn;
    this.selectedPromptIndex = index;
    this.outputTextStr = this.promptData[index].generatedOutput;
    this.selectTab('input');
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
      this.promptData[this.selectedPromptIndex].generatedOutput =
        this.outputTextStr;
      this.selectTab('output');
      //this.saveData();
    } catch (error: any) {
      this.showLoader = false;
      this.message = 'Error fetching the output!!';
      this.errorToastMsgBox.show();
    }
  }
  saveData() {
    this.currentPromptData = 'Test prompt data';
    this.inputTextStr = 'test input data';
    this.outputTextStr = 'test out put data';
    const data = {
      prompt: this.currentPromptData,
      input: this.inputTextStr,
      output: this.outputTextStr,
    };
    this.envService.createRecord(data).subscribe(
      (response) => {
        console.log('Data saved in db');
      },
      (error) => {
        console.error('Error daving data in db');
        console.log(error);
      }
    );
  }
  copyContent() {
    // this.saveData();
    this.clipboardApi.copyFromContent(this.outputTextStr);
    this.message = 'Content copied to clipboard';
    this.toastMsgBox.show();
  }

  openModal() {
    this.orig_temperature = this.temperature;
    this.orig_max_tokens = this.max_tokens;
    this.orig_top_p = this.top_p;
    this.orig_frequency_penalty = this.frequency_penalty;
    this.orig_presence_penalty = this.presence_penalty;
    this.configModal.show();
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
