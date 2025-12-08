"use client";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";
import clsx from "clsx";

let dummyId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

let mentorData = [
  {
    id: 1,
    name: "Abhishek Matlotia",
    role: "Product Manager in Orient Electric",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/orient.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9vcmllbnQuanBnIiwiaWF0IjoxNzQzNTkyMTU3LCJleHAiOjIwNTg5NTIxNTd9.s3dq_JBKQ9SR5cb8qLPfO_a4r7u-mHVtVNxhYQN09OA",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/abhishek.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hYmhpc2hlay5qcGciLCJpYXQiOjE3NDM1OTIxMjgsImV4cCI6MjA1ODk1MjEyOH0.VeQDXinMjhsmztrJWavWjg94tbt78cApP0YpY3bIf4w",
  },
  {
    id: 3,
    name: "Archana Kumari",
    role: "SWE at Google",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/google.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9nb29nbGUuanBnIiwiaWF0IjoxNzQzNTkyMjA2LCJleHAiOjIwNTg5NTIyMDZ9.WllmsQljLRg1uJirdnnLAJ9RyiXJDP89dQNttr0Bl3w",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/archana.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hcmNoYW5hLmpwZyIsImlhdCI6MTc0MzU5MjI1MiwiZXhwIjoyMDU4OTUyMjUyfQ.Gl8pyI6FHh8umxfj5avTR9lbdPM39D3IGSOWo2sFdDY",
  },
  {
    id: 4,
    name: "Dr. Lalit Gupta",
    role: "President of Cyber Security Council of India",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/algihaz.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hbGdpaGF6LmpwZyIsImlhdCI6MTc0MzU5MjI3OCwiZXhwIjoyMDU4OTUyMjc4fQ.wsAQhFVJu_CtTyuO8d2JZWsRZ1NPN6vNC5UDVvgL80g",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/lalit.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9sYWxpdC5qcGciLCJpYXQiOjE3NDM1OTIzMzUsImV4cCI6MjA1ODk1MjMzNX0.WMumM5nykU53lmbsKGExJ3Qr3t8yjqsdmpreqL-5c44",
  },
  {
    id: 5,
    name: "Himanshu Saxena",
    role: "Founder at PersonaGPT",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/personagpt.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9wZXJzb25hZ3B0LmpwZyIsImlhdCI6MTc0MzU5MjM3NiwiZXhwIjoyMDU4OTUyMzc2fQ.nbvFSJ0r6nBvAqPT0KAzhGsVmjtbI7CS1R7_QvgAkUU",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/himanshu.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9oaW1hbnNodS5qcGciLCJpYXQiOjE3NDM1OTI0MTMsImV4cCI6MjA1ODk1MjQxM30.TtP-6ID2ymoBaCR0xHLydSJlxgWTrioQkLw_CE6zFSk",
  },

  {
    id: 6,
    name: "Praveen Kumar",
    role: "Associate Director-UI core Architecture at Fitch Group",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/fitchgroup_logo.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNzRmNjU4MC01MGE2LTQ1MzMtOTgxMC0yNjM2NWQ0NGI4Y2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9maXRjaGdyb3VwX2xvZ28uanBnIiwiaWF0IjoxNzUyNDEwNDkzLCJleHAiOjIwNjc3NzA0OTN9.47q_LeJ-SWH-jelHsRUo4L-4p4Kq9R-gWaSGswdWJ5k",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/praveen.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9wcmF2ZWVuLnBuZyIsImlhdCI6MTc0MzU5MjQ3OCwiZXhwIjoyMDU4OTUyNDc4fQ.ph7kfhTT3BoSqqsNoB_VHv6pwuLZGp3RomxCk3YOL4M",
  },
  {
    id: 7,
    name: "Ravi Prakash Tripathi",
    role: "Research associate at Digital University kerela",
    company: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/kudsit_logo.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNzRmNjU4MC01MGE2LTQ1MzMtOTgxMC0yNjM2NWQ0NGI4Y2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9rdWRzaXRfbG9nby5qcGciLCJpYXQiOjE3NTI0MTM5NTksImV4cCI6MjA2Nzc3Mzk1OX0.Kdg25AStkOFa7yb912iyT6KpHP7k-wNON9RceiKAV8w",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/ravi.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9yYXZpLmpwZyIsImlhdCI6MTc0NDkxNTQyMCwiZXhwIjoyMDYwMjc1NDIwfQ.DiXy6kM3Zf_-_LkEBr4cW7MEeoitRBvD9qfJpPJSSYc",
  },
  {
    id: 8,
    name: "Simar Preet Singh",
    role: "Frontend Engineer at Redaptive Inc",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/redaptive.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9yZWRhcHRpdmUuanBnIiwiaWF0IjoxNzQzNTkyNTczLCJleHAiOjIwNTg5NTI1NzN9.KMEff2FnbL6tYA1quoxef3SDgTIgT027bJh36pTao1k",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/simar.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9zaW1hci5qcGciLCJpYXQiOjE3NDM1OTI2MDMsImV4cCI6MjA1ODk1MjYwM30.8HwuVU353PlOrONxgbclfOGX6kbCaBec0ubg-ePbI78",
  },
  {
    id: 9,
    name: "Veer Pratap Singh",
    role: "Team Lead at Antier Solutions",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/antier.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hbnRpZXIuanBlZyIsImlhdCI6MTc0MzU5MjYzMCwiZXhwIjoyMDU4OTUyNjMwfQ.01HIeMjVlTrhhaqoZkn1-1wNKWGcPKpPq5N12Nca1z8",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/veer.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS92ZWVyLmpwZWciLCJpYXQiOjE3NDM1OTI2NTUsImV4cCI6MjA1ODk1MjY1NX0.koUY3ZYv068g5_U1VpV96AdRAiZDYLOH9zWp0mHbrmc",
  },
  {
    id: 10,
    name: "Pankaj Chaudhary",
    role: "Senior Blockchain Engineer at Neural internet",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/neural_internet_logo.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNzRmNjU4MC01MGE2LTQ1MzMtOTgxMC0yNjM2NWQ0NGI4Y2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9uZXVyYWxfaW50ZXJuZXRfbG9nby5qcGciLCJpYXQiOjE3NTI0MTQxMTIsImV4cCI6MTc4Mzk1MDExMn0.RekoVrrvWimTN4RJbRgLCKCy1ghMonS4EsSFLD_pClw",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/pankaj.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9wYW5rYWouanBlZyIsImlhdCI6MTc0MzU5MjcyOCwiZXhwIjoyMDU4OTUyNzI4fQ.ihLX0hvv6dhOnwJmn7bI59HKjkawfMNHezrh1_hL5u0",
  },
  {
    id: 11,
    name: "Rajhans Choudhary",
    role: "Product Manager at Sprinklr",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/sprinklr.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9zcHJpbmtsci5qcGVnIiwiaWF0IjoxNzQzNTkyNzU5LCJleHAiOjIwNTg5NTI3NTl9.BXzrvAspyQx_WCf333zE3NTQ1DuSwjzP-2ZVczaLHOU",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/rajhans.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9yYWpoYW5zLmpwZWciLCJpYXQiOjE3NDM1OTI3OTQsImV4cCI6MjA1ODk1Mjc5NH0.dqXfRBph7CJs4PlbJqzEIFSAm9b_tEX3gHqn4QsphJk",
  },
  {
    id: 12,
    name: "Vedant Jain",
    role: "Intermediate Fullstack Engineer at GitLab",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/gitlab_com_logo.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNzRmNjU4MC01MGE2LTQ1MzMtOTgxMC0yNjM2NWQ0NGI4Y2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9naXRsYWJfY29tX2xvZ28uanBnIiwiaWF0IjoxNzUyNDE0MjE4LCJleHAiOjE3ODM5NTAyMTh9.xvN_fo-2WEYX1b4gl0HA8UAAwAuxasjN0E31h3BsUes",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/vedant.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS92ZWRhbnQuanBlZyIsImlhdCI6MTc0MzU5Mjg2MywiZXhwIjoyMDU4OTUyODYzfQ.8aqM8tguB6C7BMahrU5IHlUbFatH_Q9pZrWYnST7tNY",
  },
  {
    id: 14,
    name: "Shruti Arora",
    role: "Developer Relations at DevRelSquard",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/1735622672583.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNzRmNjU4MC01MGE2LTQ1MzMtOTgxMC0yNjM2NWQ0NGI4Y2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS8xNzM1NjIyNjcyNTgzLmpwZyIsImlhdCI6MTc1MjQxNDMxMiwiZXhwIjoxNzgzOTUwMzEyfQ.pIQJn5ekrQQqKjsfKCP2rSYhrzoigrOb7TYE_XtBl6w",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/shruti.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9zaHJ1dGkuanBlZyIsImlhdCI6MTc0MzU5MjkyNiwiZXhwIjoyMDU4OTUyOTI2fQ.MTSHrr1BnwK6XIuqO0B6a-3ge6fvVOpqdlN_FvrL9is",
  },
  {
    id: 15,
    name: "Kavach Chandra",
    role: "Chief Technology Officer at FreeStand Sampling",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/freestand.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9mcmVlc3RhbmQuanBlZyIsImlhdCI6MTc0MzU5Mjk2MSwiZXhwIjoyMDU4OTUyOTYxfQ.2R93pqSpBI5-C_ShTaimy1gvQxheUcXpp89-2CfhtQg",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/kachav.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9rYWNoYXYuanBlZyIsImlhdCI6MTc0MzU5Mjk4OCwiZXhwIjoyMDU4OTUyOTg4fQ.ymAmgn90LnTlDLMN4J6F8CWyssiMxjVUxomDTcQLcYU",
  },
  {
    id: 16,
    name: "Sudip Mondal",
    role: "Software Engineer at Mando",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/mandosystems_logo.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNzRmNjU4MC01MGE2LTQ1MzMtOTgxMC0yNjM2NWQ0NGI4Y2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9tYW5kb3N5c3RlbXNfbG9nby5qcGciLCJpYXQiOjE3NTI0MTQzOTUsImV4cCI6MTc4Mzk1MDM5NX0.CKh_TABOg8SKQZ_ev4DDp5ylrPXdv46BkiajcIQQIvE",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/sudip.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9zdWRpcC5qcGVnIiwiaWF0IjoxNzQzNTkzMDUyLCJleHAiOjIwNTg5NTMwNTJ9.VWOXWGbqR_H8JTtvNIMhf_3VOMIMw-gz6nJpZKBT49w",
  },
  {
    id: 17,
    name: "Sadanand Pai",
    role: "Software Developer Engineer 3 at Atlassian",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/atlassian.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hdGxhc3NpYW4uanBlZyIsImlhdCI6MTc0MzU5MzA3NywiZXhwIjoyMDU4OTUzMDc3fQ.hAHneg4V1CQSnvwllqLLUrfgeTc04XBvThaIYfHN_II",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/sadanand.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9zYWRhbmFuZC5qcGVnIiwiaWF0IjoxNzQzNTkzMTAwLCJleHAiOjIwNTg5NTMxMDB9.pLe7x4NyTlKTS01pTEZdoi6a2S6EiqX-MQA7RuuwSnU",
  },
  {
    id: 18,
    name: "Devbrat Anand",
    role: "Software Engineer II at Electronic Arts",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/EA.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9FQS5qcGVnIiwiaWF0IjoxNzQzNTkzMTI0LCJleHAiOjIwNTg5NTMxMjR9.LVKtLC36snl9a4ahjuG5DkkwvaXdIizHBfaEOTri6Pw",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/devbrat.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9kZXZicmF0LmpwZWciLCJpYXQiOjE3NDM1OTMxNTgsImV4cCI6MjA1ODk1MzE1OH0.I4CItdqfkl-sIvfs7s0ux68dXoJA0ZUp65-oJ8PUPMs",
  },
  {
    id: 19,
    name: "Vishal Gupta",
    role: " SDE II at Goldman Sachs",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/goldman_sachs_logo.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNzRmNjU4MC01MGE2LTQ1MzMtOTgxMC0yNjM2NWQ0NGI4Y2MiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9nb2xkbWFuX3NhY2hzX2xvZ28uanBnIiwiaWF0IjoxNzUyNDE0NTI1LCJleHAiOjE3ODM5NTA1MjV9.x1w_qETYQB7d8z23jXcX9XoTIShSbj6Znd0qhWLWS1c",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/vishal.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS92aXNoYWwuanBlZyIsImlhdCI6MTc0MzU5MzI3NSwiZXhwIjoyMDU4OTUzMjc1fQ.FZmRnnv4QnmmkyWUZ1aWV4-T0LV-HElrZvTHE_p3t9s",
  },
  {
    id: 20,
    name: "Ritwik Agarwal",
    role: "CEO's Office at Peer Robotics",
    company:
      "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/peerrobotics.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9wZWVycm9ib3RpY3MuanBlZyIsImlhdCI6MTc0MzU5MzMwMCwiZXhwIjoyMDU4OTUzMzAwfQ.0x9aiK6drMW5HXrrSvJdAwIkTCJj0L_5atuLN9Eg4vE",
    img: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/ritwik.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9yaXR3aWsuanBlZyIsImlhdCI6MTc0MzU5MzMyNCwiZXhwIjoyMDU4OTUzMzI0fQ.5Vy7KM4skh2aD1ALSq2T7k7RebOY1cvt5oJmwdX-GJ8",
  },
];

export default function MentorSlider() {
  return (
    <>
      <div className="h-[2px] bg-[#0000003a] w-[90%] mx-auto" />
      <h2 className="text-3xl md:text-4xl font-extrabold text-black text-center mb-10 tracking-tight my-10">
        Connect with Experts from the World's Top MAANG Companies
      </h2>
      <Swiper
        slidesPerView={1.2}
        spaceBetween={30}
        breakpoints={{
          600: { slidesPerView: 2, spaceBetween: 25 },
          750: { slidesPerView: 3, spaceBetween: 30 },
          1000: { slidesPerView: 4, spaceBetween: 35 },
          1350: { slidesPerView: 5, spaceBetween: 40 },
        }}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={2500}
        loop={true}
        modules={[Autoplay]}
        className="mySwiper text-black px-2 py-10 overflow-visible"
      >
        {mentorData.map((mentor) => (
          <SwiperSlide
            key={mentor.id}
            className="mentorcard bg-white/90 backdrop-blur-lg p-8 rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0px_15px_35px_rgba(0,0,0,0.3)] flex flex-col items-center w-[280px] h-[380px] min-h-[380px] overflow-visible mt-6 mb-6"
          >
            <div className="relative w-full flex flex-col items-center h-full justify-between">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <img
                  src={mentor.img}
                  alt={mentor.name}
                  className="w-[120px] h-[120px] object-cover rounded-full border-4 border-white shadow-lg"
                />

                {/* Name */}
                <h1 className="mt-5 text-md md:text-lg font-semibold text-gray-900 text-center">
                  {mentor.name}
                </h1>

                {/* Role */}
                <p className="text-sm md:text-base h-[50px] text-gray-600 text-center max-w-[280px] leading-relaxed line-clamp-2 mt-2">
                  {mentor.role}
                </p>
              </div>

              <div className="flex flex-col items-center mt-8">
                <img
                  src={mentor.company}
                  alt={mentor.name}
                  className="w-[37px] h-[37px] md:w-[50px] md:h-[50px] rounded-md object-contain"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="h-[2px] bg-[#0000003a] w-[90%] mx-auto mb-20 mt-20" />
    </>
  );
}
