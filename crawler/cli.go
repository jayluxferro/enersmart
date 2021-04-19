package main

import (
	ecg "github.com/jayluxferro/ecg"
	"fmt"
  "os"
)

func usage(){
  fmt.Printf("%s [MeterNumber]\n", os.Args[0])
  os.Exit(1)
}

func main() {
  if len(os.Args) != 2 {
    usage() 
  }

  meterNumber := os.Args[1]
  balanceHandler(&meterNumber)
}

func balanceHandler(meterNumber *string){
	params := ecg.GetParams(*meterNumber, "", "", "", "")
  res := ecg.InitGetMeterBalance(params)
  fmt.Println(res)
}
