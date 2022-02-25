import { Component, OnInit } from '@angular/core';
import data from '../data/promptData.json';
import { Configuration, OpenAIApi } from 'openai';
import { HttpClient } from '@angular/common/http';
import { EnvServiceService } from './env-service.service';

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
    '*1212#*sk-iSwTwSy8NXDN7afXsebpT3Blbk*1212#*FJUCoHbGUuxeba0gG4eA0n*1212#*';
  constructor(
    private http: HttpClient,
    private envService: EnvServiceService
  ) {}

  ngOnInit() {
    this.getAPIData();
    this.fetchSecretKey();
    // this.loadEnv();
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
    });
  }
  getAPIData() {
    try {
      this.http
        .get(`${window.location.origin}/getKey`)
        .subscribe((response: any) => {
          if (response.data) {
            console.log('success');
            //add code to use api data
          }
        });
    } catch (error) {
      console.log('error');
      //catch error
    }
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
  wordCounter(str: string) {
    this.wordCount = str ? str.split(/\s+/) : 0;
    this.totalWords = this.wordCount ? this.wordCount.length : 0;
  }
  setPromptData(promptData: string, currentBtn: string) {
    this.currentPromptData = promptData;
    this.currentPromptBtn = currentBtn;
    console.log(this.currentPromptData + '\n\n' + this.inputTextStr + '\n\n');
  }
  configuration = new Configuration({
    apiKey: 'process.env.OPENAI_SECRET_KEY',
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
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          frequency_penalty: 2,
          presence_penalty: 0,
        }
      );
      this.outputResponse = completion;
      this.outputTextStr = this.outputResponse.data.choices[0].text;
      this.showLoader = false;
      console.log(completion);
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      this.showLoader = false;
    }
  }
}
