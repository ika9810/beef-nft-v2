async function mint1(){
    ////////////////////////현재 날짜 구하기 //////////////////
    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var hours = ('0' + today.getHours()).slice(-2); 
    var minutes = ('0' + today.getMinutes()).slice(-2);
    var seconds = ('0' + today.getSeconds()).slice(-2); 

    var dateString = year + month + day + hours + minutes + seconds;
    ////토큰 아이디
    const id = dateString.toString(16);
    ////생성 시기 스탬프
    const birth_time = String(today.getTime()/ 1000);
    //////////////////////////////////////////////////

    $('#nft-loading').show();
    const img = $('.file-upload-image').attr('src');
    const grade = $('#meat-grade').text();
    const data = {"grade" : grade,"img": img}

    ///////////////////메타데이터 설정////////////
    let metadata_data = {"metadata": {
        "description": "Beef NFT는 AI 소고기 등급 판별기를 통해 발행된 NFT로 AI 기반으로 소고기 이미지를 통해 소고기의 등급을 판별한 후 판별된 등급을 NFT에 저장해 인증서를 발급한다.",
        "external_url": "https://beef.honeyvuitton.com/", 
        "image": img, 
        "name": "Beef NFT",
    
        "attributes": [{
            "display_type": "date",
            "trait_type": "Birthday",
            "value": String(today.getTime()/ 1000),
        },
        {
            "trait_type": "grade",
            "value": grade
        },]},
    }
    console.log(JSON.stringify(metadata_data));
    ////////////////////////////////////////////////////////////////메타데이터 생성 Metadata API
    const metadata_options = {
        method: 'POST',
        url: 'https://metadata-api.klaytnapi.com/v1/metadata',
        headers: {
            'Content-Type': 'application/json',
            'x-chain-id': '1001',
            "Authorization": 'Basic S0FTS0wyQlMxRDFJMUczREowRTdFUDhEOmptd2hlNkZrcXZLLWxheTUxWHJ5QktJVFJPaXE5MUtyRE9OMjFxR0Q='
        },
        data: JSON.stringify(metadata_data)
    };
    let metadata_header = {headers: {
            'Content-Type': 'application/json',
            'x-chain-id': '1001',
            "Authorization": 'Basic S0FTS0wyQlMxRDFJMUczREowRTdFUDhEOmptd2hlNkZrcXZLLWxheTUxWHJ5QktJVFJPaXE5MUtyRE9OMjFxR0Q='
        },
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-chain-id': '1001',
            Authorization: 'Basic S0FTS0wyQlMxRDFJMUczREowRTdFUDhEOmptd2hlNkZrcXZLLWxheTUxWHJ5QktJVFJPaXE5MUtyRE9OMjFxR0Q='
        },
        body: JSON.stringify(metadata_data)
    };

    fetch('https://metadata-api.klaytnapi.com/v1/metadata', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

    // axios.request(metadata_options).then(function (response) {
    //     console.log(response.data);
    //     const kip17_data = {"to" : "0x24b2803c34b11740acd0cc35648e34163c5cba0c", "id": dateString.toString(16), "uri": response.data["uri"],}
    //     const kip17_options = {
    //         method: 'POST',
    //         url: 'https://kip17-api.klaytnapi.com/v2/contract/0xe3a390fdb12dafe2eb37d7829d11a18f37e59424/token',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'x-chain-id': '1001',
    //             "Authorization": 'Basic S0FTS0wyQlMxRDFJMUczREowRTdFUDhEOmptd2hlNkZrcXZLLWxheTUxWHJ5QktJVFJPaXE5MUtyRE9OMjFxR0Q='
    //         },
    //         data: JSON.stringify(kip17_data)
    //     };
    //     console.log(kip17_data,kip17_options);
    //     alert("NFT를 발행하시겠습니까?")
    //     axios.request(kip17_options).then(function (response) {
    //         console.log(response.data);
    //     }).catch(function (error) {
    //         console.error(error);
    //     });
    // }).catch(function (error) {
    //     console.error(error);
    // })
}



const options = {
    method: 'POST',
    url: 'https://metadata-api.klaytnapi.com/v1/metadata',
    headers: {
      'Content-Type': 'application/json',
      'x-chain-id': '1001',
      Authorization: 'Basic S0FTS0wyQlMxRDFJMUczREowRTdFUDhEOmptd2hlNkZrcXZLLWxheTUxWHJ5QktJVFJPaXE5MUtyRE9OMjFxR0Q='
    },
    data: {
      metadata: {
        description: 'Beef NFT는 AI 소고기 등급 판별기를 통해 발행된 NFT로 AI 기반으로 소고기 이미지를 통해 소고기의 등급을 판별한 후 판별된 등급을 NFT에 저장해 인증서를 발급한다.'
      }
    }
  };
  
  axios.request(options).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });
/////////////////////////////////////////////////////////////////////KIP-17 API

const mint_options = {
    method: 'POST',
    url: 'https://kip17-api.klaytnapi.com/v2/contract/0xe3a390fdb12dafe2eb37d7829d11a18f37e59424/token',
    headers: {
      'Content-Type': 'application/json',
      'x-chain-id': '1001',
      Authorization: 'Basic S0FTS0wyQlMxRDFJMUczREowRTdFUDhEOmptd2hlNkZrcXZLLWxheTUxWHJ5QktJVFJPaXE5MUtyRE9OMjFxR0Q='
    },
    data: '{\n        "to": "0x24b2803c34b11740acd0cc35648e34163c5cba0c",\n        "id": 10000000000,\n        "uri": "uri",\n}'
  };
  
  axios.request(mint_options).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.error(error);
  });