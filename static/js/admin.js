// custom
$(function(){
  $('#loader').hide()
  $('#rechargeBtnView').show()
  $('#voucherView').hide()
  network('MTN')
  getMeter()
})


function setMeter(meter){
  window.localStorage.setItem('meter', meter)
}

function getMeter(){
  $('#meter').val(window.localStorage.getItem('meter') ?? '')
}

function network(n){
  if(n === "Vodafone"){
    $('#voucherView').show()
  }else {
    $('#voucherView').hide()
  }
}

function processBalance(){
  const meter = $('#meter').val().trim()
  if(meter.length < 8){
    displayWarning('Invalid Meter Number')
    return
  }

  setMeter(meter)
  $('#loader').show()
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
  $('#rechargeBtnView').hide()
  $('#log').val('')
  setMeter(meter)
  // send data
  $.post('/', {
    meter,
    network,
    phone,
    voucher,
    amount
  }, data => {
    $('#loader').hide()
    $('#rechargeBtnView').show()
    $('#log').val(data)
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
