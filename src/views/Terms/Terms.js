import { Header, Footer } from '@layout'
import PDF from "@images/Term_of_service_EDUZONE.pdf"
import './Terms.scss'

const Terms = () => (
  <>
    <Header />
    <section className="terms">
      <div className="container">
        <div className="terms__info">
          <h2 className="terms__title">Terms of Services</h2>
          <p className="terms__text">
            <b>Effective Date:</b> This policy was last updated on February 26,
            2021 
          </p>
          <p className="terms__text">
            We take privacy very seriously at EDU-ZONE LLC (hereafter called
            "EDU-ZONE") and this policy is designed to tell you what information
            we collect and how we use it.
          </p>
          <p className="terms__text">
            EDU-ZONE offers its members access to educational contents designed
            for young boys and girls, where they can interact and practice with
            curricular school material, engage in learning activities, play
            games and view videos. The Service is provided through EDU-ZONE’s
            website currently located at www.EDUZONESERVER.COM ("Site"). The
            Data Protection Officer for EDU-ZONE can be contacted at{' '}
            <a
              href="mailto:edu-zone.support@edu-zone.org"
              className="terms__link"
            >
              edu-zone.support@edu-zone.org
            </a>{' '}
          </p>
          <p className="terms__text">
            This policy forms part of our 
            <a className="terms__link" href={PDF} download> terms of service </a>
            and explains your rights and responsibilities when using our
            services. If you have any questions, please contact us at company{' '}
            <a
              href="mailto:edu-zone.support@edu-zone.org"
              className="terms__link"
            >
              edu-zone.support@edu-zone.org
            </a>{' '}
            or +1(305)7670929.
          </p>

          <hr className="terms__line" />

          <h3 className="terms__subtitle">
            Information we collect from parents
          </h3>
          <p className="terms__text">
            To become a EDU-ZONE member, a parent must register for a regular
            account. The parent is required to provide the following
            information: 
          </p>
          <ul className="terms__list">
            <li className="terms__item">Email and password.</li>
            <li className="terms__item">
              Further, the parent is required to make a payment through a
              third-party payment service; however, EDU-ZONE never receives this
              credit card information. The payment is required to verify adult
              status and establish the parent’s identity and is required to meet
              laws of the United States of America.
            </li>
          </ul>

          <hr className="terms__line" />

          <h3 className="terms__subtitle">
            Information we collect from children
          </h3>
          <p className="terms__text">
            When a user’s associated parent email is verified, that user may
            optionally provide his own email address. This email address may be
            used to notify him of pending, pre-monitored messages or of new
            offerings on the site. He is also offered the option to share his
            birthdate, which allows customization of his experience on EDU-
            ZONE.
          </p>
          <p className="terms__text">
            EDU-ZONE does not condition a child’s participation in an activity
            on the disclosure of more information than is reasonably necessary
            to participate.
          </p>
          <p className="terms__text">
            <b>Other information we collect:</b> Cookies, log files and
            entry/exit URLs
          </p>
          <p className="terms__text">
            Like most web sites, EDU-ZONE uses cookies and web log files to
            track site usage. A cookie is a tiny data file that resides on your
            computer that allows EDU-ZONE to recognize you as a user when you
            return to our site using the same computer and web browser.
            Unfortunately, if your browser settings do not allow cookies, you
            will not be able to use our website. Like the information you enter
            at registration or in your Profile settings, cookie and log file
            data is used to customize your experience on the web site. We
            require session cookies and log file data to meet our contractual
            obligations to members.
          </p>
          <p className="terms__text">
            EDU-ZONE uses what is called a &quot;session&quot; cookie, which
            identifies a particular visit to the EDU-ZONE site. Session cookies
            expire after a short time or when you close your web browser.
          </p>
          <p className="terms__text">
            In addition, if you enable the automatic login feature, a
            &quot;persistent&quot; cookie stays on your computer between
            sessions to allow EDU-ZONE to recognize your user account the next
            time you visit. This cookie is removed if you turn off this
            automatic login or if you switch users. At this time EDU-ZONE does
            not use other &quot;persistent&quot; cookies.
          </p>
          <p className="terms__text">
            Due to the communication standards on the Internet, when you visit
            the EDU-ZONE web site we automatically receive the URL of the site
            from which you came and the site to which you are going when you
            leave EDU-ZONE. We also receive the Internet protocol (IP) address
            of your computer (or the proxy server you use to access the World
            Wide Web), your computer operating system and type of web browser
            you are using, as well as the name of your ISP. This information is
            used to analyze overall trends to help us improve the EDU-ZONE
            service, but is not linked to personally identifiable information in
            any way.
          </p>

          <hr className="terms__line" />

          <h3 className="terms__subtitle">Third party service providers</h3>
          <p className="terms__text">
            EDU-ZONE collects certain types of information in order to operate
            and improve our service to you and other users. We use third parties
            Google Analytics and FullStory to gather data on how many visit what
            EDU-ZONE pages, what paths are taken by members to get to EDU-ZONE,
            which browsers are used most, and other statistics, as well as how
            and what in our site is used. EDU-ZONE , Inc. is the sole owner of
            the information collected on this site and this these third parties
            does not share user data. For more information on Google Analytics
            and FullStory policies, click{' '}
            <a
              href="https://policies.google.com/terms?hl=en"
              target="_blank"
              className="terms__link"
              rel="noreferrer"
            >
              here
            </a>{' '}
            and{' '}
            <a
              href="https://www.fullstory.com/legal/privacy-policy"
              target="_blank"
              className="terms__link"
              rel="noreferrer"
            >
              here
            </a>
            . Regardless of their policies we have taken strong measures to
            block both parties from receiving personally identifiable
            information.
          </p>

          <hr className="terms__line" />

          <h3 className="terms__subtitle">
            Sharing Information with Third Parties
          </h3>
          <p className="terms__text">
            We will never sell, rent, or otherwise provide your personally
            identifiable information to any third parties for marketing
            purposes. We will only share your personally identifiable
            information with third parties to carry out your instructions and to
            provide specific services. For instance, we use a payment and credit
            card processing company to bill users for subscription fees. We also
            use third party software development firms and server hosting
            services. For more information on the third parties we work with,
            please email us at{' '}
            <a
              href="mailto:edu-zone.support@edu-zone.org"
              className="terms__link"
            >
              edu-zone.support@edu-zone.org
            </a>{' '}
          </p>

          <hr className="terms__line" />

          <h3 className="terms__subtitle">How we use this information</h3>
          <p className="terms__text">
            We transfer Information and Personally Identifiable Information
            between Europe and the United States. By visiting our Web site and
            providing us with data, you acknowledge and agree that your personal
            information may be processed for the purposes identified in this
            policy. In addition, such data may be stored on servers located
            outside your resident jurisdiction, which may have less stringent
            privacy practices than your own jurisdiction. Please note that
            EDU-ZONE’ own policies adhere to all requirements of the United
            States for its users from the USA. By providing us with your data,
            you consent to the transfer of such data.
          </p>
          <p className="terms__text">
            It is possible that we may need to disclose personal information
            when required by law. We will disclose such information wherein we
            have a good-faith belief that it is necessary to comply with a court
            order, ongoing judicial proceeding, or other legal process served on
            our company or to exercise our legal rights or defend against legal
            claims.
          </p>
          <p className="terms__text">EDU-ZONE Communications.</p>
          <p className="terms__text">
            EDU-ZONE will communicate with you through email and notices posted
            on this website. These include occasional emails to inform you about
            various features of the service.
          </p>

          <hr className="terms__line" />

          <h3 className="terms__subtitle">
            How to update or remove your information
          </h3>
          <p className="terms__text">
            You can review the personal information you provided us and make any
            desired changes to the information, or to the settings for your
            EDU-ZONE account, at any time by logging in to your account on the
            EDU-ZONE website and editing the account and profile information. To
            request that we close your account and remove your information,
            please send us your request and we will take care of it. Please send
            your request using the email account that you have registered with
            EDU-ZONE under your name. You will receive a response to requests
            sent to us within five business days of our receiving it.
          </p>

          <hr className="terms__line" />

          <h3 className="terms__subtitle">Content retention</h3>
          <p className="terms__text">
            There are four main types of data retained by EDU-ZONE:
          </p>
          <ul className="terms__list">
            <li className="terms__item">
              An individual’s data that does not impact others’ activities, such
              as a member’s profile information, his virtual currency holdings,
              or his virtual castle and pets.
            </li>
            <li className="terms__item">
              Logs of user activities on the site.
            </li>
            <li className="terms__item">
              Records of parents’ financial transactions with EDU-ZONE. No
              credit card data is stored and payments are handled by{' '}
              <a
                href="https://www.paypal.com/us/webapps/mpp/ua/privacy-full"
                target="_blank"
                className="terms__link"
                rel="noreferrer"
              >
                a third party service provider. AQUI LINK A STRIPE.
              </a>{' '}
            </li>
          </ul>
          <p className="terms__text">
            This data is retained as long as reasonable to provide our services
            to you.
          </p>
          <p className="terms__text">
            If a user requests account deletion, then their profile and
            associated data is deleted from our records within 20 business days.
          </p>

          <hr className="terms__line" />

          <h3 className="terms__subtitle">Links out</h3>
          <p className="terms__text">
            We may include links to third parties from the website or services.
            EDU-ZONE isn’t responsible for these companies and because we have a
            link doesn’t mean we endorse them. Your use of our services maybe
            subject to the terms and conditions, <a className="terms__link" href={PDF} download> terms of service </a>
            and privacy policies of other services that we don’t control such as
            mobile app stores, mobile software platforms or payment processors.
            Please be sure to check their privacy policies if you decide to
            visit them.
          </p>

          <hr className="terms__line" />

          <h3 className="terms__subtitle">Security</h3>
          <p className="terms__text">
            We follow generally accepted industry standards to protect the
            personal information submitted to us, both during transmission and
            once we receive it. No method of transmission over the Internet, or
            method of electronic storage, is 100% secure, however. Therefore,
            while we strive to use commercially acceptable means to protect your
            personal information, we cannot guarantee its absolute security.
          </p>
          <p className="terms__text">
            If you have any questions about security on our Web site, please
            contact us at {' '}
            <a
              href="mailto:edu-zone.support@edu-zone.org"
              className="terms__link"
            >
              edu-zone.support@edu-zone.org
            </a>{' '}.
          </p>

          <hr className="terms__line" />

          <h3 className="terms__subtitle">Company contact information</h3>
          <p className="terms__text">
            If you have questions or comments about this privacy policy, please
            contact us at{' '}
            <a
              href="mailto:edu-zone.support@edu-zone.org"
              className="terms__link"
            >
              edu-zone.support@edu-zone.org
            </a>{' '}
            via email or by mail at EDU-ZONE LLC 18800 NE 29 th ave , unit 727
            Florida 33180.
          </p>
        </div>
      </div>
    </section>
    <Footer />
  </>
)

export default Terms
