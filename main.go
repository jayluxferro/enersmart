package main

import (
	"github.com/gin-gonic/gin"
	_ "github.com/heroku/x/hmetrics/onload"
	ecg "github.com/jayluxferro/ecg"
	"log"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.LoadHTMLGlob("templates/*.tmpl.html")
	router.Static("/static", "static")

  var production = false
  if(os.Getenv("MODE") == "prod"){
    production = true
  }
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.tmpl.html", gin.H{
      "production": production,
    })
	})

	// receive data
	router.POST("/verify-otp", verifyOTPHandler)
	router.POST("/send-otp", sendOTPHandler)
  router.POST("/balance", balanceHandler)
	router.POST("/", rechargeHandler)

	router.Run(":" + port)
}

func unAuthorized(c *gin.Context) {
	c.JSON(http.StatusForbidden, gin.H{"error": "unauthorized"})
}

func verifyOTPHandler(c *gin.Context){
	params := getDefaultParams(c)
	otp := c.PostForm("otp")
	res := ecg.VerifyOTP(params, otp)
	if res {
		c.String(http.StatusOK, "success")
	}else {
		c.String(http.StatusOK, "error")
	}
}

func sendOTPHandler(c *gin.Context){
	params := getDefaultParams(c)
	res := ecg.SendOTP(params)
	if res {
		c.String(http.StatusOK, "success")
	}else {
		c.String(http.StatusOK, "error")
	}
}

func balanceHandler(c *gin.Context){
	meterNumber := c.PostForm("meter")
	params := ecg.GetParams(meterNumber, "", "", "", "")
  res := ecg.InitGetMeterBalance(params)
  c.String(http.StatusOK, res)
}

func getDefaultParams(c *gin.Context) *ecg.Params{
	meterNumber := c.PostForm("meter")
	network := c.PostForm("network")
	phone := c.PostForm("phone")
	voucher := c.PostForm("voucher")
	amount := c.PostForm("amount")
	return ecg.GetParams(meterNumber, phone, network, voucher, amount)
}

func rechargeHandler(c *gin.Context) {
	params := getDefaultParams(c)
	res := ecg.InitMakePayment(params)
	c.String(http.StatusOK, res)
}
