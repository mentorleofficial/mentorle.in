'use client'

import Card from "@/components/ResourceCard";
import Resource from "@/components/ResourceCard";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

let backendCloud = [
    {
        name: "Google Cloud",
        description: "Google Cloud offers cloud computing services.",
        link: "https://cloud.google.com/edu/students/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/googlecloud.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9nb29nbGVjbG91ZC5wbmciLCJpYXQiOjE3NDM2MTI0MTgsImV4cCI6MjA1ODk3MjQxOH0.YYTj5IvhyB8iL6bvvdpPNJIsJXP3YsI0kVG249Fd_kY"
    },
    {
        name: "Firebase",
        description: "Firebase offers backend services like database, authentication, hosting etc.",
        link: "https://firebase.google.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/firebase.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9maXJlYmFzZS5qcGciLCJpYXQiOjE3NDM2MTM0MDAsImV4cCI6MjA1ODk3MzQwMH0.Vi9MEX75skv8TFgwlU4P5H6yinRi1l2XjCbGrMBKGsY"
    },
    {
        name: "MongoDB",
        description: "MongoDB is a NoSQL database that stores data in JSON-like documents.",
        link: "https://www.mongodb.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/mongodb.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9tb25nb2RiLnBuZyIsImlhdCI6MTc0MzYxMzQ0NSwiZXhwIjoyMDU4OTczNDQ1fQ.mSNorGxMEtZCJOVySEeT9hgPt5gxKToEg5Ir6nMXYAM"
    },
    {
        name: "AWS",
        description: "Amazon Web Services offers a wide range of cloud services.",
        link: "https://aws.amazon.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/aws.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hd3MucG5nIiwiaWF0IjoxNzQzNjEzNDYzLCJleHAiOjIwNTg5NzM0NjN9.mRVE9Hm8I3RHYRoZRqlEJvSZ1FaV-_g50PYN-hEM9Bo"
    },
    {
        name: "Heroku",
        description: "Heroku is a cloud platform that lets you build, deliver, monitor and scale apps.",
        link: "https://www.heroku.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/heroku.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9oZXJva3UuanBnIiwiaWF0IjoxNzQzNjE2MTYyLCJleHAiOjIwNTg5NzYxNjJ9.HW9gaqiFhmsCUapD1PIDEy2UdQCunaeLHnSRLUkIhBE"
    },
    {
        name: "Azure",
        description: "Microsoft Azure is a cloud computing service for building, testing, deploying, and managing applications and services.",
        link: "https://azure.microsoft.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/azure.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9henVyZS5wbmciLCJpYXQiOjE3NDM2MTYxODUsImV4cCI6MjA1ODk3NjE4NX0.VDtNVa6gb7UISvs8LRsLLPBzXR8qWLoiKri_xXpOTm0"
    },
    {
        name: "DigitalOcean",
        description: "DigitalOcean is a cloud infrastructure provider.",
        link: "https://www.digitalocean.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/digitalocean.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9kaWdpdGFsb2NlYW4ucG5nIiwiaWF0IjoxNzQzNjE2MjE1LCJleHAiOjIwNTg5NzYyMTV9.5zSJ-1xCsF1WD2llHMDgOgVpEu9DWFaf9KUPWoWZJNE"
    },
    {
        name: "Prisma",
        description: "Prisma is an open-source database toolkit.",
        link: "https://www.prisma.io/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/prisma.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9wcmlzbWEuc3ZnIiwiaWF0IjoxNzQzNjE3NzM1LCJleHAiOjIwNTg5Nzc3MzV9.adtB3z7Fk9SHYqYtsg-h1RZZ7QJzmEYxUF7Res2hg9g"
        },
];

let backendHosting = [
    {
        name: "Firebase",
        description: "Firebase offers backend services like database, authentication, hosting etc.",
        link: "https://firebase.google.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/firebase.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9maXJlYmFzZS5qcGciLCJpYXQiOjE3NDM2MTM0MDAsImV4cCI6MjA1ODk3MzQwMH0.Vi9MEX75skv8TFgwlU4P5H6yinRi1l2XjCbGrMBKGsY"
    },
    {
        name: "Heroku",
        description: "Heroku is a cloud platform that lets you build, deliver, monitor and scale apps.",
        link: "https://www.heroku.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/heroku.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9oZXJva3UuanBnIiwiaWF0IjoxNzQzNjE2MTYyLCJleHAiOjIwNTg5NzYxNjJ9.HW9gaqiFhmsCUapD1PIDEy2UdQCunaeLHnSRLUkIhBE"
    },
    {
        name: "Netlify",
        description: "Netlify is a web developer platform that multiplies productivity.",
        link: "https://www.netlify.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/netlify.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9uZXRsaWZ5LnBuZyIsImlhdCI6MTc0MzYxNjM5MSwiZXhwIjoyMDU4OTc2MzkxfQ.F2apTfzevATVPCSxC8CGXy00YvDsUtMqJzkGboa8wjU"
    },
    {
        name: "Vercel",
        description: "Vercel is a cloud platform for static sites and Serverless Functions.",
        link: "https://vercel.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/vercel.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS92ZXJjZWwuanBnIiwiaWF0IjoxNzQzNjE2NDI4LCJleHAiOjIwNTg5NzY0Mjh9.ysxgF0V2ENnJDb2YwtFMnMQfBJJu-830cSZxGsheCYA"
    },
    {
        name: "Docker",
        description: "Docker is a platform for developers and sysadmins to develop, ship, and run applications.",
        link: "https://www.docker.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/docker.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9kb2NrZXIucG5nIiwiaWF0IjoxNzQzNjE2NDQxLCJleHAiOjIwNTg5NzY0NDF9.V8lHj9SBWSFpYDvxezwXTMIbgi6kuSo-iBOtRBQUMiQ"
    },
    {
        name: "Back4App",
        description: "Back4App is a backend as a service platform.",
        link: "https://www.back4app.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/back4app.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9iYWNrNGFwcC5wbmciLCJpYXQiOjE3NDM2MTY0NTgsImV4cCI6MjA1ODk3NjQ1OH0.ROAKVsVLxh_qIHs-7Izh0FFHZGeYnGwDePhFleu7dXk"
    },
    {
        name: "Render",
        description: "Render is a cloud platform for building and running web apps and websites.",
        link: "https://render.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/render.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9yZW5kZXIucG5nIiwiaWF0IjoxNzQzNjE2NTc4LCJleHAiOjIwNTg5NzY1Nzh9.WDbVNfBRF5QI34J70yXZUEE9oDEyX0MsZfZ2fRVqqAM"
    }
];

let cloudAuthentication = [
    {
        name: "Auth0",
        description: "Auth0 is a flexible, drop-in solution to add authentication and authorization services to your applications.",
        link: "https://auth0.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/auth0.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hdXRoMC5qcGciLCJpYXQiOjE3NDM2MTY2MTksImV4cCI6MjA1ODk3NjYxOX0.8ox9qgDXWV8b2MwGwpj9ZNh0N_Mwsu_Il_UKxfx2rAw"
    },
    {
        name: "Firebase",
        description: "Firebase offers backend services like database, authentication, hosting etc.",
        link: "https://firebase.google.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/firebase.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9maXJlYmFzZS5qcGciLCJpYXQiOjE3NDM2MTM0MDAsImV4cCI6MjA1ODk3MzQwMH0.Vi9MEX75skv8TFgwlU4P5H6yinRi1l2XjCbGrMBKGsY"
    },
    {
        name: "Okta",
        description: "Okta is an identity and access management service.",
        link: "https://www.okta.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/okta.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9va3RhLnBuZyIsImlhdCI6MTc0MzYxNjY2NSwiZXhwIjoyMDU4OTc2NjY1fQ.vEYuAj8RqOLhzda6b3A1Zfk2AH3YHBVfrY9G1kjzlok"
    },
    {
        name: "AWS Cognito",
        description: "Amazon Cognito lets you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily.",
        link: "https://aws.amazon.com/cognito/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/awscognito.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9hd3Njb2duaXRvLnBuZyIsImlhdCI6MTc0MzYxNjY0NywiZXhwIjoyMDU4OTc2NjQ3fQ.WtEcou4bxTI0-cGlZK5fYQD0yxOQ5QJzgdQxHez88yw"
    },
    {
        name: "Passport.js",
        description: "Passport is authentication middleware for Node.js.",
        link: "http://www.passportjs.org/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/passport.avif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9wYXNzcG9ydC5hdmlmIiwiaWF0IjoxNzQzNjE2Njc4LCJleHAiOjIwNTg5NzY2Nzh9.QvMKmpVGt75ygS4yH1Ss__5pWvZvC166qbm3W5nQ3ZU"
    },
    {
        name: "Stytch",
        description: "Stytch is a developer platform for user authentication.",
        link: "https://stytch.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/stytch.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9zdHl0Y2guanBnIiwiaWF0IjoxNzQzNjE2ODUyLCJleHAiOjIwNTg5NzY4NTJ9._jRE4TgjFpwZvCWbOPHicCD5HSJWB945p33_M5YKECE"
    },
    {
        name: "JWT",
        description: "JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.",
        link: "https://jwt.io/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/jwt.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9qd3QucG5nIiwiaWF0IjoxNzQzNjE2ODc4LCJleHAiOjIwNTg5NzY4Nzh9.AeGGcAvCp9EMwl-rgxeB1O_GIrwHymmyHRo1bF35LGo"
    }
];

let webdev = [
    {
        title: "Illustration",
        items: [
            {
                name: "DrawKit",
                description: "DrawKit is a collection of free, beautiful, customisable MIT licensed SVG illustrations in two styles, to use on your next website, app, or project.",
                link: "https://www.drawkit.io/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/drawkit.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9kcmF3a2l0LmpwZyIsImlhdCI6MTc0MzYxNjkzMCwiZXhwIjoyMDU4OTc2OTMwfQ.O9wiyQzL-hl5S2OGDyAvd4S0DRvjZvQD7zjH_YTbicw"
            },
            {
                name: "unDraw",
                description: "Open-source illustrations for any idea you can imagine and create.",
                link: "https://undraw.co/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/undraw.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS91bmRyYXcucG5nIiwiaWF0IjoxNzQzNjE2OTYyLCJleHAiOjIwNTg5NzY5NjJ9.13RIIuv_9U5JAsoeTWp-_HvRLj5C4IzUSTfSkLA4ThA"
            },
            {
                name: "Pixeltrue",
                description: "Pixeltrue is a collection of high-quality, free-to-use illustrations.",
                link: "https://www.pixeltrue.com/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/pixeltrue.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9waXhlbHRydWUucG5nIiwiaWF0IjoxNzQzNjE2OTczLCJleHAiOjIwNTg5NzY5NzN9.485seauHZ5PjfBZlqB4dt0fgKpprAUSfRa6lZGLCQ40"
            },
            {
                name: "Handz",
                description: "Handz is a collection of free, high-quality illustrations.",
                link: "https://handz.design/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/handz.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9oYW5kei5qcGciLCJpYXQiOjE3NDM2MTY5OTUsImV4cCI6MjA1ODk3Njk5NX0.k0On7MDrfIC9znksAFgI-OqkacK3zDm52-3mDY3Ixrw"
            },
            {
                name: "StorySet",
                description: "Free customizable illustrations for your next project.",
                link: "https://storyset.com/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/storyset.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9zdG9yeXNldC5wbmciLCJpYXQiOjE3NDM2MTcwNjgsImV4cCI6MjA1ODk3NzA2OH0.hcpvKCmOTxwdRrEmH7iULz2H5G-cJoPdLnRZUk_g9Ao"
            }
        ]
    },
    {
        title: "Icons",
        items: [
            {
                name: "Flaticon",
                description: "Flaticon offers vector icons in SVG, PSD, PNG, EPS format or as ICON FONT.",
                link: "https://www.flaticon.com/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/flaticon.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9mbGF0aWNvbi5wbmciLCJpYXQiOjE3NDM2MTcwOTQsImV4cCI6MjA1ODk3NzA5NH0.CIlOBTpmTSsKQng5pTUBZ66gDxyppd5TESWHpiXCBMk"
            },
            {
                name: "Iconshock",
                description: "Iconshock offers over 2 million icons in 30 design styles.",
                link: "https://www.iconshock.com/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/iconshock.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9pY29uc2hvY2sucG5nIiwiaWF0IjoxNzQzNjE3MTI3LCJleHAiOjIwNTg5NzcxMjd9.gC5SZ4jAy2uwAPv8nBS12I70_3aYi6Qau1-Sd71BiKo"
            },
            {
                name: "Boxicons",
                description: "Boxicons is a simple vector icons set carefully crafted for designers and developers.",
                link: "https://boxicons.com/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/boxicons.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9ib3hpY29ucy5qcGciLCJpYXQiOjE3NDM2MTcyMDksImV4cCI6MjA1ODk3NzIwOX0.NovlH5Zi7mD-fzsKZpfv_6-tU_SiHUk8NfcRED68Suk"
            },
            {
                name: "Akar Icons",
                description: "Akar Icons is a perfect solution for your next project.",
                link: "https://akaricons.com/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/akaricons.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9ha2FyaWNvbnMucG5nIiwiaWF0IjoxNzQzNjE3MjI3LCJleHAiOjIwNTg5NzcyMjd9.xUigfzXKvR8d2OuvfYNYUT-uk2uJgIr0PvAsiP9jW_c"
            },
            {
                name: "Radix Icons",
                description: "Radix Icons is a set of 15 free, high-quality SVG icons.",
                link: "https://icons.modulz.app/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/radixicons.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9yYWRpeGljb25zLnBuZyIsImlhdCI6MTc0MzYxNzMwOCwiZXhwIjoyMDU4OTc3MzA4fQ.x5uLzuELQStvXp_TqqZ4-x7NOAzQMIRrwge3pAF3jiM"
            }
        ]
    },
    {
        title: "SVG",
        items: [
            {
                name: "Shapefest",
                description: "Shapefest is a collection of free, beautiful, customisable MIT licensed SVG illustrations in two styles, to use on your next website, app, or project.",
                link: "https://shapefest.com/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/shapefest.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9zaGFwZWZlc3QucG5nIiwiaWF0IjoxNzQzNjE3MzQyLCJleHAiOjIwNTg5NzczNDJ9.aH8pjZgMCno9q6uion8pG_8cf3INejWTrza7P8t0zlg"
            },
            {
                name: "Dicebear",
                description: "Dicebear is a free and open-source toolbox for generating unique SVG design assets.",
                link: "https://www.dicebear.com/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/dicebear.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9kaWNlYmVhci5qcGVnIiwiaWF0IjoxNzQzNjE3Mzc0LCJleHAiOjIwNTg5NzczNzR9.z5i8iYlbXbjyimJ9oyFnaitfr9z1xi8fsxyXVen40bA"
            },
            {
                name: "Haikei",
                description: "Haikei is a web-based design tool to generate unique SVG design assets.",
                link: "https://haikei.app/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/haikei.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9oYWlrZWkuanBlZyIsImlhdCI6MTc0MzYxNzQyMiwiZXhwIjoyMDU4OTc3NDIyfQ.LrgUoDV6DEqVAbB27LFvs0s7y2mza9LDrBgEAJ9ZUME"
            },
            {
                name: "Freepik",
                description: "Freepik offers free vectors, photos and PSD downloads.",
                link: "https://www.freepik.com/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/freepik.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9mcmVlcGlrLmpwZyIsImlhdCI6MTc0MzYxNzM5OSwiZXhwIjoyMDU4OTc3Mzk5fQ.8XVHetH7ntOe-wkBfBub9ScqkA4aigD3IeHIXgnnuWk"
            },
            {
                name: "Blobmaker",
                description: "Blobmaker is a free generative design tool made with React and SVG.",
                link: "https://www.blobmaker.app/",
                image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/blobmaker.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9ibG9ibWFrZXIuanBnIiwiaWF0IjoxNzQzNjE3NDM3LCJleHAiOjIwNTg5Nzc0Mzd9.XPi9KqejUNMArD_Fshd2AtLcKArcz-UdmBk7h-UNmvs"
            }
        ]
    }

];

let games = [
    {
        name: "Kern Type",
        description: "Kern Type is a game that helps you learn how to kern type.",
        link: "https://type.method.ac/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/KernType.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9LZXJuVHlwZS5wbmciLCJpYXQiOjE3NDM2MTc1MDYsImV4cCI6MjA1ODk3NzUwNn0.jTKaYhMWKSLsTuQ2YrJa7E10pT9J8uR15r2cdcZ_2T8",
    },
    {
        name: "Shape Type",
        description: "Shape Type is a game that helps you learn how to kern type.",
        link: "https://shape.method.ac/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/ShapeType.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9TaGFwZVR5cGUucG5nIiwiaWF0IjoxNzQzNjE3NTM4LCJleHAiOjIwNTg5Nzc1Mzh9.mvOxrwQhx83RBnJ1u1kKHffbDRbS5uqveE5TVlsov6o",
    },
    {
        name: "Flexbox Defense",
        description: "Flexbox Defense is a game that helps you learn how to use flexbox.",
        link: "http://www.flexboxdefense.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/FlexboxDefence.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9GbGV4Ym94RGVmZW5jZS5wbmciLCJpYXQiOjE3NDM2MTc1NjIsImV4cCI6MjA1ODk3NzU2Mn0.jZgzaLBl-XQWwvQez0ujuZp9-21Fo8U4VqKf74Wrwkg",
    },
    {
        name: "Grid Garden",
        description: "Grid Garden is a game that helps you learn how to use CSS Grid.",
        link: "https://cssgridgarden.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/GridGarden.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9HcmlkR2FyZGVuLnBuZyIsImlhdCI6MTc0MzYxNzYzNywiZXhwIjoyMDU4OTc3NjM3fQ.n_CgDt2d1O7uCJAFEYZ5w3MSZYb3YJ8ZRtmb81xReco",
    },
    {
        name: "Flexbox Froggy",
        description: "Flexbox Froggy is a game that helps you learn how to use flexbox.",
        link: "https://flexboxfroggy.com/",
        image: "https://zzocepwobcnmflkewzss.supabase.co/storage/v1/object/sign/media/FlexFroggy.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJtZWRpYS9GbGV4RnJvZ2d5LnBuZyIsImlhdCI6MTc0MzYxNzYxNywiZXhwIjoyMDU4OTc3NjE3fQ.Hwy1oirGYj8tnM1cgeWiQa0Guz50ZS7gi44CgfAMLSY",
    }
]

let fellowships = [
    // {
    //     name: "Flexboxy",
    //     description: "Flexbox Frogg.",
    //     link: "https://flexboxfroggy.com/",
    //     image: "/images.png",
    // },
    // {
    //     name: "Flexboxy",
    //     description: "Flexbox Frogg.",
    //     link: "https://flexboxfroggy.com/",
    //     image: "/images.png",
    // }


]

let blogs = [

    // {
    //     name: "EA",
    //     description: "Flegyy.",
    //     link: "https://flexboxfroggy.com/",
    //     image: "/images.png",
    // },
    // {
    //     name: "EA",
    //     description: "Flegyy.",
    //     link: "https://flexboxfroggy.com/",
    //     image: "/images.png",
    // }


]

export default function Resources() {
    return (
        <div className="my-20 min-h-[60vh] sm:h-auto flex flex-col mx-10 lg:mx-28">

            <h1 className="text-4xl lg:text-6xl font-semibold mb-7">Resources</h1>
            <Tabs defaultValue="backend" className="w-full">
                <TabsList>
                    <TabsTrigger value="backend">Backend</TabsTrigger>
                    <TabsTrigger value="webdev">Frontend</TabsTrigger>
                    <TabsTrigger value="games">Games</TabsTrigger>
                    <TabsTrigger value="fellowships">Fellowships</TabsTrigger>
                    <TabsTrigger value="blogs">Blogs</TabsTrigger>


                </TabsList>
                <TabsContent value="backend">
                    <h2 className="text-3xl sm:text-4xl font-bold mt-8 mb-5">Cloud Platforms</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                        {backendCloud.map((card, index) => (
                            <Card key={index} {...card} />
                        ))}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mt-14 mb-5">Authentication</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                        {cloudAuthentication.map((card, index) => (
                            <Card key={index} {...card} />
                        ))}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mt-8 mb-5">Hosting</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                        {backendHosting.map((card, index) => (
                            <Card key={index} {...card} />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="webdev">
                    {
                        webdev.map((section, index) => (
                            <div key={index}>
                                <h2 className="text-3xl sm:text-4xl font-bold mt-8 mb-5">{section.title}</h2>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                                    {section.items.map((card, index) => {
                                        return <Card key={index} {...card} />
                                    })}
                                </div>
                            </div>
                        ))
                    }
                </TabsContent>
                <TabsContent value="games">
                    <p className="mt-8"></p>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                        {games.map((card, index) => (
                            <Card key={index} {...card} />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="fellowships">
                    <p className="mt-8"></p>
                    {fellowships.length > 0 ? (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                            {fellowships.map((card, index) => (
                                <Card key={index} {...card} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No fellowship programs available at the moment.</p>
                            <p className="text-gray-400 text-sm mt-2">Check back soon for updates!</p>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="blogs">
                    <p className="mt-8"></p>
                    {blogs.length > 0 ? (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                            {blogs.map((card, index) => (
                                <Card key={index} {...card} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No blog posts available at the moment.</p>
                            <p className="text-gray-400 text-sm mt-2">Check back soon for updates!</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

        </div>
    )
}