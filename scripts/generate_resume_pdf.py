from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = "output/pdf/Tushar_Pant_Resume_2026.pdf"


def make_styles():
    base = getSampleStyleSheet()
    navy = colors.HexColor("#12314F")
    teal = colors.HexColor("#0E7C7B")
    slate = colors.HexColor("#263238")
    muted = colors.HexColor("#52616B")

    return {
        "name": ParagraphStyle(
            "name",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=24,
            textColor=navy,
            alignment=TA_CENTER,
            spaceAfter=3,
        ),
        "headline": ParagraphStyle(
            "headline",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=13,
            textColor=slate,
            alignment=TA_CENTER,
            spaceAfter=5,
        ),
        "contact": ParagraphStyle(
            "contact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=10.2,
            textColor=muted,
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "section": ParagraphStyle(
            "section",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=10.2,
            leading=12,
            textColor=teal,
            uppercase=True,
            spaceBefore=8,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.6,
            leading=11.2,
            textColor=slate,
            spaceAfter=4,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.0,
            leading=10.2,
            textColor=slate,
            spaceAfter=3,
        ),
        "role": ParagraphStyle(
            "role",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.2,
            leading=11,
            textColor=navy,
        ),
        "date": ParagraphStyle(
            "date",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=10,
            textColor=muted,
            alignment=TA_RIGHT,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.25,
            leading=10.4,
            textColor=slate,
            leftIndent=8,
            firstLineIndent=0,
        ),
        "link": ParagraphStyle(
            "link",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.25,
            leading=10.4,
            textColor=colors.HexColor("#0B5CAD"),
        ),
    }


def p(text, style):
    return Paragraph(text, style)


def bullets(items, styles):
    return ListFlowable(
        [ListItem(p(item, styles["bullet"]), leftIndent=8) for item in items],
        bulletType="bullet",
        start="-",
        leftIndent=10,
        bulletFontName="Helvetica",
        bulletFontSize=8,
        bulletOffsetY=0,
        spaceBefore=1,
        spaceAfter=3,
    )


def section(title, styles):
    return [p(title.upper(), styles["section"]), HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#D8E1E8"), spaceAfter=4)]


def role_block(company, role, dates, location, items, styles):
    head = Table(
        [[p(f"{role} | {company}", styles["role"]), p(dates, styles["date"])]],
        colWidths=[4.4 * inch, 2.0 * inch],
        hAlign="LEFT",
    )
    head.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
            ]
        )
    )
    block = [head]
    if location:
        block.append(p(location, styles["small"]))
    block.append(bullets(items, styles))
    return KeepTogether(block)


def build_resume():
    styles = make_styles()
    doc = BaseDocTemplate(
        OUTPUT,
        pagesize=letter,
        leftMargin=0.62 * inch,
        rightMargin=0.62 * inch,
        topMargin=0.48 * inch,
        bottomMargin=0.48 * inch,
        title="Tushar Pant Resume",
        author="Tushar Pant",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="resume", frames=[frame])])

    story = []
    story.append(p("Tushar Pant", styles["name"]))
    story.append(p("Senior Software Engineer | Full Stack MERN Developer | React, Node.js, TypeScript, AWS", styles["headline"]))
    story.append(
        p(
            "India | +91 9794516644 | tarkesh2shar@gmail.com | "
            '<link href="https://www.linkedin.com/in/tushar-pant-46075497/">linkedin.com/in/tushar-pant-46075497</link> | '
            '<link href="https://github.com/tarkesh2shar">github.com/tarkesh2shar</link>',
            styles["contact"],
        )
    )

    story += section("Summary", styles)
    story.append(
        p(
            "Full-stack software engineer with 7+ years of experience building React, Node.js, TypeScript, and MERN products across enterprise, commerce, communication, and mobile teams. Strong in reusable UI systems, API/middle-service development, testing, real-time workflows, AWS serverless architecture, and DevOps learning through Docker/Kubernetes projects. Known for converting product/design requirements into maintainable components and production-ready features.",
            styles["body"],
        )
    )

    story += section("Core Skills", styles)
    skill_rows = [
        ["Frontend", "React.js, TypeScript, JavaScript, Redux, SCSS/Sass, CSS logical properties, Storybook/Chromatic, responsive UI"],
        ["Backend", "Node.js, Express, REST APIs, microservices, JWT/auth, WebSockets, gRPC, MySQL, MongoDB"],
        ["Cloud/DevOps", "AWS CDK, Lambda, API Gateway, Cognito, DynamoDB, SQS, EventBridge, Docker, Kubernetes, Skaffold, CI/CD"],
        ["Testing", "Jest, React Testing Library, Enzyme, Cypress, Nightwatch.js, Mocha, Chai, Istanbul, AWS synthetic tests"],
        ["Mobile/Other", "React Native, Android, Flutter/Dart, Three.js, RabbitMQ/AMQP, NATS, Python ML practice"],
    ]
    skills_table = Table([[p(a, styles["role"]), p(b, styles["small"])] for a, b in skill_rows], colWidths=[1.2 * inch, 5.2 * inch])
    skills_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 1.5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
            ]
        )
    )
    story.append(skills_table)

    story += section("Certifications", styles)
    certs = [
        "AWS Certified Developer - Associate - Amazon Web Services, issued Oct 2025, expires Oct 2028",
        "AWS Cloud Quest: Serverless Developer - Amazon Web Services, issued Jul 2025",
        "Building with the Claude API - Anthropic, issued Mar 2026",
        "Model Context Protocol: Advanced Topics - Anthropic, issued Apr 2026",
        "Introduction to Model Context Protocol - Anthropic, issued Apr 2026",
        "Claude Code in Action - Anthropic, issued Mar 2026",
    ]
    story.append(p("; ".join(certs), styles["small"]))

    story += section("Professional Experience", styles)
    story.append(
        role_block(
            "EPAM Systems / EPAM Anywhere",
            "Senior Software Engineer (A3), previously Software Engineer (A2)",
            "Apr 2022 - Present",
            "Remote",
            [
                "Build and maintain production React.js features for an international client team, translating product and Figma requirements into reusable, tested UI components.",
                "Review PRs, guide implementation decisions, and support team formation/engineering practices across frontend delivery.",
                "Develop Node.js middle-service APIs and contribute to code migration toward TypeScript for safer, more maintainable delivery.",
                "Design and work with AWS serverless/event-driven resources using CDK, Lambda, API Gateway, Cognito, SQS, EventBridge, DynamoDB, and synthetic tests.",
                "Cover quality through unit, integration, API contract, Cypress/Nightwatch, Storybook/Chromatic, React Testing Library, and AWS synthetic testing.",
            ],
            styles,
        )
    )
    story.append(
        role_block(
            "Blinkit (Grofers)",
            "Software Development Engineer I",
            "Aug 2021 - Mar 2022",
            "Hybrid",
            [
                "Worked with the Experience Team across React Native, Android, and web-facing release workflows.",
                "Built and debugged native-to-React Native bridge communication and contributed to out-of-stock product experiences across Android and React Native.",
                "Owned continuous delivery/code-push movement from staging to production across iOS, Android, and web platforms.",
            ],
            styles,
        )
    )
    story.append(
        role_block(
            "Acquire.io",
            "Full Stack Developer",
            "Jun 2020 - Aug 2021",
            "Remote",
            [
                "Delivered frontend and backend features for the VOIP team using React.js, Redux, Node.js, MySQL, Redis, RabbitMQ, gRPC, and Git.",
                "Built reusable React components and real-time state synchronization through WebSockets so data stayed consistent across devices.",
                "Built APIs in a microservices architecture and explored integrations with RingCentral, Dialpad, Twilio webhooks, Google Speech-to-Text, IBM Watson, and AWS alternatives.",
                "Wrote API unit tests with Mocha/Chai and measured coverage with Istanbul.",
            ],
            styles,
        )
    )
    story.append(
        role_block(
            "CodeMaya",
            "Full Stack Engineer",
            "Feb 2020 - Apr 2020",
            "",
            [
                "Contributed to an e-commerce style web app with Node.js, MongoDB, React.js, REST APIs, JWT authentication, and Git.",
                "Built backend features for deal scraping/listing, signup/signin, push notifications via OneSignal, and SEO-friendly meta-tag sharing.",
            ],
            styles,
        )
    )
    story.append(
        role_block(
            "Freelancer",
            "Full-stack Developer",
            "Jan 2018 - Dec 2019",
            "Remote",
            [
                "Built React, MERN, Flutter, and React Native experiments, including YouTube players, blog apps, fake e-commerce, Apex stats with Paytm, and Flutter widget prototypes.",
                "Worked with designers to bring screens to life and used React, Redux, MongoDB, Express, Passport Google OAuth, PayPal/Paytm, Bootstrap, Expo, and Heroku.",
            ],
            styles,
        )
    )

    story += section("Selected Projects", styles)
    projects = [
        ("Node Docker Kube Microservice", "Node/Docker/Kubernetes microservices with auth, tickets, orders, payments, expiration services, shared common code, Skaffold, infra, and NATS-style event thinking.", "https://github.com/tarkesh2shar/node-docker-kube-microservce"),
        ("React SSR + Express/Webpack", "Server-side rendered React/Redux app using Express, Webpack, React Helmet, API proxying, SCSS/CSS support, file imports, and autoprefixing.", "https://github.com/tarkesh2shar/reactSSR"),
        ("Docker AWS CI Pipelines", "Single and multi-container Docker CI/CD experiments deploying to AWS with Travis, ECR-oriented container separation, and NGINX proxy/TLS termination.", "https://github.com/tarkesh2shar/multi"),
        ("expressydecorators", "TypeScript Express decorator package experiment using reflect metadata, Swagger UI, and reusable backend routing patterns.", "https://github.com/tarkesh2shar/expressydecorators"),
        ("Machine Learning Practice", "Python practice repo covering regression, classification, clustering, model selection, PCA/LDA, SVM, random forests, and reinforcement learning exercises.", "https://github.com/tarkesh2shar/machineLearningPractice"),
        ("React Native for Web / Flutter", "Cross-platform UI work with Expo, React Native for Web, Flutter Provider boilerplate, and Android app experiments.", "https://github.com/tarkesh2shar/reactNativeForWeb"),
    ]
    for name, desc, url in projects:
        story.append(p(f"<b>{name}</b> - {desc} <link href=\"{url}\">{url}</link>", styles["small"]))

    story += section("Education & Training", styles)
    story.append(p("<b>B.Tech, Electrical and Electronics Engineering</b> - United College of Engineering and Research, APJAKTU, 2017", styles["small"]))
    story.append(p("<b>Industrial Training:</b> Power Distribution Systems at Bharat Pumps and Compressor Ltd.; PLC and SCADA training at Sofcon India Pvt. Ltd.", styles["small"]))
    story.append(p("<b>Earlier technical work:</b> Arduino ATmega328P animatronics hand controller, college robotics/drone projects, Android weather/camera/geolocation apps.", styles["small"]))

    doc.build(story)


if __name__ == "__main__":
    build_resume()
