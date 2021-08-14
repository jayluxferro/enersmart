// custom

var defaultPayload = null

$(function(){
  $('#loader').hide()
  $('#rechargeBtnView').show()
  $('#voucherView').hide()
  $('#otpForm').hide()
  $('#payForm').show()
  $('#logView').hide()
  $('#serverActive').hide()
  $('#serverOffline').hide()
  getServerStatus()
  network('MTN')
  getMeter()
  setInterval(getServerStatus, 1800 * 1000)
})


function setMeter(meter){
  window.localStorage.setItem('meter', meter)
}

function getMeter(){
  $('#meter').val(window.localStorage.getItem('meter') ?? '')
}

function network(n){
  $('#voucherView').hide()
  /*
  if(n === "Vodafone"){
  }else {
    $('#voucherView').hide()
  }
  */
}

function getServerStatus(){
  //console.log('Checking server status')
  const settings = {
    "url": "https://api.github.com/repos/jayluxferro/enersmart/commits",
    "method": "GET",
    "timeout": 0,
  }

  $.ajax(settings).done(function (response) {
    if (response && response.length){
      const lastUpdate = new Date(response[0].commit.message)
      if(((new Date().getUTCHours()) - lastUpdate.getUTCHours()) <= 1){
        //console.log('server active')
        $('#serverActive').show()
        $('#serverOffline').hide()
      }else{
        //console.log('server might be offline')
        $('#serverActive').hide()
        $('#serverOffline').show()
      }
    }
  })
}

function processBalance(){
  const meter = $('#meter').val().trim()
  if(meter.length < 8){
    displayWarning('Invalid Meter Number')
    return
  }

  setMeter(meter)
  $('#loader').show()
  setLoaderMessage('Please wait... Don\'t leave the page.')
  $('#rechargeBtnView').hide()
  $('#log').val('')
  // send data
  $.post('/balance', {
    meter
  }, data => {
    $('#loader').hide()
    $('#rechargeBtnView').show()
    $('#log').val(data)
    if(data.search('balance') != -1){
      data = JSON.parse(data)
      swal('Current Balance', `GHS ${data['balance']}`, 'success')
    }else{
      displayError('Process failed. Try again.')
    }
  })
}

function sendOTP(){
  $('#loader').show()
  setLoaderMessage('Registering your number with ECG...')
  $('#payForm').hide()
  $('#otpForm').hide()
  
  $.post('/send-otp', defaultPayload, data => {
    if(data == 'success'){
      swal('Phone Number Verification', 'A Verification Code has been sent to your phone number. Enter the code to proceed.', 'success')
    }else {
      swal('Phone Number Verification', 'Phone Number verification failed. Please try again.', 'error')
    }
    $('#otpForm').show()
    $('#loader').hide()
  })

}

function exitOTP(){
  $('#loader').hide()
  $('#payForm').show()
  $('#otpForm').hide()
  $('#otpBtnView').show()
  $('#otp').val('')
}

function verifyOTP(){
  const otp = $('#otp').val().trim()
  if (otp.length < 5){
    displayWarning('Invalid Code length')
    return
  }

  $('#loader').show()
  $('#otpBtnView').hide()
  setLoaderMessage('Verifying Code... Please wait.')

  // all set
  const payload = { otp, ...defaultPayload }
  $.post('/verify-otp', payload, data => {
    if(data == 'success'){
      // initiate payment
      exitOTP()
      processRequest()
    }else {
      swal('Phone Number Verification', 'Invalid Code', 'error')
      $('#otpBtnView').show()
      $('#loader').hide()
    }
  })

}

function processRequest(){
  const meter = $('#meter').val().trim()
  const network = $('#network').val().trim()
  const phone = $('#phone').val().trim()
  const voucher = $('#voucher').val().trim()
  const amount = $('#amount').val().trim()
  if(meter.length < 8){
    displayWarning('Invalid Meter Number')
    return
  }

  if(phone.length != 10){
    displayWarning('Invalid Phone Number')
    return
  }

  if(!amount.length){
    displayWarning('Invalid Amount')
    return
  }

  $('#loader').show()
  setLoaderMessage('Please wait... Don\'t leave the page.')
  $('#rechargeBtnView').hide()
  $('#log').val('')
  setMeter(meter)
  defaultPayload = {
    meter,
    network,
    phone,
    voucher,
    amount
  }
  // send data
  $.post('/', defaultPayload, data => {
    $('#loader').hide()
    $('#rechargeBtnView').show()
    $('#log').val(data)
    if(data.search('register') != -1){
      // register phone number
      sendOTP()
      return
    }

    if(data.search('transactionId') != -1){
      swal('Payment Confirmation', 'Transaction initiated. Kindly confirm on your phone. If the payment prompt doesn\'t show, check your pending approvals and confirm the payment.', 'success')
    }else{
      displayError('Process failed. Try again.')
    }
  })
}

function displaySuccess(msg){
  swal("Success", msg, "success");
}

function displayWarning(msg){
  swal("Warning", msg, "warning");
}

function displayError(msg){
  swal("Error", msg, "error");
}

function setLoaderMessage(message){
  $('#loader-text').html(message)
}
