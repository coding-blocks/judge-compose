# CodingBlocks Judge v2

This is CodingBlocks' new code judge

All required componenets are dockerized, so you can
simply `docker-compose up` and get going ;) 

## Components

### `api` : The API server
This is the judge api server
It has 3 endpoints - 
 - /api/runs (to run code and get output)
 - /api/submissions (to evaluate testcases)
 - /api/langs (to show supported languages)

### `rabbitmq` : An AMQP queue
Standard rabbitmq server to create queue of tasks

We use a standard RPC setup with a `job_queue`
and a `success_queue`


### `taskmaster` : The conductor of all workers
The taskmaster runs a worker when a task is 
received on the queue

### `worker-{lang}` : Workers (for each language)
Available workers - 
 - cpp
 - c
 - java8
 - 

## Running

Tl;DR;

Step 1:  
 Copy `judgeapi-example.env` to `.env`

Step 2:  
```bash
docker-compose up
```

### Environment Variables

Check judgeapi-example.env
