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
	router.POST("/", rechargeHandler)

	router.Run(":" + port)
}

func unAuthorized(c *gin.Context) {
	c.JSON(http.StatusForbidden, gin.H{"error": "unauthorized"})
}

func rechargeHandler(c *gin.Context) {
	meterNumber := c.PostForm("meter")
	network := c.PostForm("network")
	phone := c.PostForm("phone")
	voucher := c.PostForm("voucher")
	amount := c.PostForm("amount")
	params := ecg.GetParams(meterNumber, phone, network, voucher, amount)
	res := ecg.InitMakePayment(params)
	c.String(http.StatusOK, res)
}
