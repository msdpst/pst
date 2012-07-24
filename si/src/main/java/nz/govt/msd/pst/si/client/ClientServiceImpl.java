package nz.govt.msd.pst.si.client;

import nz.govt.msd.pst.messaging.client.*;

import javax.xml.ws.BindingProvider;

public class ClientServiceImpl {

    public static void main(String[] args) {
        ObjectFactory objectFactory = new ObjectFactory();
        CreateBasicNoteRequest request = objectFactory.createCreateBasicNoteRequest();
        request.setInvokingUser("jluff001");
        request.setSwn("318381847");
        request.setSubjectTypeId("APSN");
        request.setShortDescription("PST Test");
        request.setNoteText("Note text from PST test");

        ClientServiceSoap clientServiceSoap = new ClientService().getClientServiceSoap();
        BindingProvider bp = (BindingProvider) clientServiceSoap;
        bp.getRequestContext().put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY,
                "http://trivs035.ssi.govt.nz:46002/client/client/services/ClientService.jws");
        /*
        List<Handler> handlerChain = new ArrayList<Handler>();
        handlerChain.add(new SOAPAuthenticationHandler());
        handlerChain.add(new SoapEnvelopeLogger());
        bp.getBinding().setHandlerChain(handlerChain);
        */

        clientServiceSoap.createNote(request);
    }

    public static void main2(String[] args) {
        ObjectFactory objectFactory = new ObjectFactory();
        MinimalClientDetailsRequest request = objectFactory.createMinimalClientDetailsRequest();
        request.setInvokingUser("jluff001");
        request.getSwn().add("318381847");

        ClientServiceSoap clientServiceSoap = new ClientService().getClientServiceSoap();
        BindingProvider bp = (BindingProvider) clientServiceSoap;
        bp.getRequestContext().put(BindingProvider.ENDPOINT_ADDRESS_PROPERTY,
                "http://trivs035.ssi.govt.nz:46002/client/client/services/ClientService.jws");
        /*
        List<Handler> handlerChain = new ArrayList<Handler>();
        handlerChain.add(new SOAPAuthenticationHandler());
        handlerChain.add(new SoapEnvelopeLogger());
        bp.getBinding().setHandlerChain(handlerChain);
        */

        MinimalClientDetailsResponse response = clientServiceSoap.minimalDetails(request);
        System.out.println(response);
    }
}
