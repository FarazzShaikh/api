package main

import (
	"io/ioutil"
	"log"
	"net/http"
)

func homePage(w http.ResponseWriter, r *http.Request) {

	resp, err := http.Get("https://github.com/FarazzShaikh")
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	w.Write(body)
}

func handleRequests() {
	http.HandleFunc("/", homePage)
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func main() {
	handleRequests()
}
