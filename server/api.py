from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import requests
import time
import datetime
import re
#########################################################
app = FastAPI()
origins = ["*"]

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

#위의 설정은 모든 origin, 모든 cookie, 모든 method, 모든 header를 allow한다.
########################POST를 위한 모델 설정#############################
class NFT(BaseModel):
    grade: str
    img: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
######################메타데이터 생성하기###########################
def createMetadata(grade, img):
    url = "https://metadata-api.klaytnapi.com/v1/metadata"
    payload = {
        "metadata": {
            "description": "Beef NFT는 AI 소고기 등급 판별기를 통해 발행된 NFT로 AI 기반으로 소고기 이미지를 통해 소고기의 등급을 판별한 후 판별된 등급을 NFT에 저장해 인증서를 발급한다.",
            "external_url": "https://beef.honeyvuitton.com/", 
            "image": img, 
            "name": "Beef NFT",
            #Opensea에서 property 에 등록될 수 있는 형식으로 바꾸어 줬고, NFT의 생성일자도 birthday형식으로 지정했는데 이 때 unix timestamp형식이 필요해서 해당 형식에 맞게 진행하였다.
            "attributes": [{
                "display_type": "date",
                "trait_type": "Birthday",
                "value": str(time.time()),
            },
            {
                "trait_type": "grade",
                "value": grade
            },]
        },
        # "filename": "test.json"
    }
    headers = {
        "x-chain-id": "1001",
        "Authorization": "Basic S0FTS0wyQlMxRDFJMUczREowRTdFUDhEOmptd2hlNkZrcXZLLWxheTUxWHJ5QktJVFJPaXE5MUtyRE9OMjFxR0Q=",
        "Content-Type": "application/json"
    }

    response = requests.request("POST", url, json=payload, headers=headers)
    # {
    # "contentType": "application/json",
    # "filename": "13126799-5d29-06f8-ea1d-ff5f5165ce35.json",
    # "uri": "https://metadata-store.klaytnapi.com/9c7de118-cf48-8ab5-f186-4ed29b9cf6b7/13126799-5d29-06f8-ea1d-ff5f5165ce35.json"
    # }     //KAS Medata API 메타데이터 생성 부분 리턴 형태
    print(response.json())
    return response.json()['uri']
    
def mintNFT(uri, tokenID):
    url = "https://kip17-api.klaytnapi.com/v2/contract/0xe3a390fdb12dafe2eb37d7829d11a18f37e59424/token" #beefcoin
    
    payload = {
        "to": "0x24b2803c34b11740acd0cc35648e34163c5cba0c",
        "id": tokenID,
        "uri": uri,
    }
    headers = {
        "x-chain-id": "1001",
        "Authorization": "Basic S0FTS0wyQlMxRDFJMUczREowRTdFUDhEOmptd2hlNkZrcXZLLWxheTUxWHJ5QktJVFJPaXE5MUtyRE9OMjFxR0Q=",
        "Content-Type": "application/json"
    }

    response = requests.request("POST", url, json=payload, headers=headers)
    return response.json()


@app.get("/", tags=["Root"])
async def read_root():
  return { 
    "message": "Welcome to my Project by JONGHEON LEE"
   }
   
@app.post("/test")
async def TEST(item: test):
    params = dict(item)
    return params

# @app.get("/nftMint")
# async def test():
#   res = createMetadata()
#   #KAS에서 토큰을 발행할 때 토큰 아이디는 무조건 16진수여야 한다 현재시간을 일렬로 정수형만 추출해 16진수로 변환시켜서 호출한다.
#   hex_tokenID = hex(int('0x'+re.sub(r'[^0-9]', '',str(datetime.datetime.now())),16))
#   result  = mintNFT(res, hex_tokenID)
#   result["Klaytnscope"] = "https://baobab.scope.klaytn.com/tx/"+result["transactionHash"]+"?tabId=nftTransfer"
#   print(result)
#   return result

@app.post("/nftMint")
async def MINT(item: NFT):
    params = dict(item)
    #print(params,type(params))
    if params["grade"]:
        metaURI = createMetadata(params["grade"],params["img"])
        #KAS에서 토큰을 발행할 때 토큰 아이디는 무조건 16진수여야 한다 현재시간을 일렬로 정수형만 추출해 16진수로 변환시켜서 호출한다.
        hex_tokenID = hex(int('0x'+re.sub(r'[^0-9]', '',str(datetime.datetime.now())),16))
        print(hex_tokenID)
        result = mintNFT(metaURI,hex_tokenID)
        print(result)
        return result
    else:
        return params